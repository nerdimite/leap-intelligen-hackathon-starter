import hashlib
import lancedb
from typing import Dict, Any
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector
from lancedb.query import LanceQueryBuilder
from wiki_chunker import LangChainWikiChunker

embed_func = get_registry().get("openai").create(name="text-embedding-ada-002")
embed_dims = embed_func.ndims()


class WikiChunk(LanceModel):
    text: str = embed_func.SourceField()
    vector: Vector(embed_dims) = embed_func.VectorField()
    h1: str
    h2: str
    h3: str
    source: str
    id: str


class VectorDB:
    def __init__(self, db_path: str, table_name: str):
        # Create and Connect to the Database
        self.db = lancedb.connect(db_path)
        self.table = self.db.create_table(table_name, schema=WikiChunk, exist_ok=True)

        # Setup the Chunking Module
        self.chunker = LangChainWikiChunker()
        self.document_metadata = {}

    def build_table_item(self, chunk) -> Dict[str, Any]:
        """
        Prepare the chunk for insertion into the LanceDB table.
        """
        text = self.chunker.build_chunk_text(chunk)
        vector_id = hashlib.md5(text.encode()).hexdigest()
        return {
            "text": text,
            "source": chunk.metadata["Source"],
            "h1": chunk.metadata["Headers"].get("H1", ""),
            "h2": chunk.metadata["Headers"].get("H2", ""),
            "h3": chunk.metadata["Headers"].get("H3", ""),
            "id": vector_id,
        }

    def insert_data_without_duplicates(self, items):
        """
        Inserts the items into the LanceDB table while avoiding duplicates already in the table. It uses the ID field to check for duplicates.
        """
        # Check for existing IDs in the table before adding new items
        item_ids_str = (
            str([item["id"] for item in items]).replace("[", "(").replace("]", ")")
        )
        existing_items = (
            self.table.search()
            .where(f"id in {item_ids_str}")
            .select(["id"])
            .limit(0)
            .to_list()
        )
        if len(existing_items) > 0:
            print(f"Skipping {len(existing_items)} items as they already exist.")
            existing_ids = [item["id"] for item in existing_items]
            items_to_add = [item for item in items if item["id"] not in existing_ids]
        else:
            items_to_add = items

        if len(items_to_add) > 0:
            print(f"Adding {len(items_to_add)} of {len(items)} items.")
            self.table.add(items_to_add)
        else:
            print("No new items to add.")

    def ingest_directory(
        self, directory: str, recursive: bool = True, ignore_toc: bool = True
    ):
        """
        Ingest a directory of markdown documents into the vector database.
        """
        chunks, document_metadata = self.chunker.process_directory(
            directory, recursive=recursive, ignore_toc=ignore_toc
        )
        items = [self.build_table_item(chunk) for chunk in chunks]
        self.insert_data_without_duplicates(items)
        self.document_metadata = document_metadata

    def search(self, query: str) -> LanceQueryBuilder:
        """
        Search the database for the query. This returns a LanceQueryBuilder object which can be used to filter and sort the results.

        Example:
            vector_db = VectorDB("wiki_test", "wiki_test")
            query = "What is the capital of the moon?"
            results = vector_db.search(query).where("source = 'wiki/crypto.md'", prefilter=True).select(["text", "source"]).limit(5).to_list()
        """

        return self.table.search(query)
