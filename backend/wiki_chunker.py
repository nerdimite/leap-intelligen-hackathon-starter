"""Module for chunking markdown wiki content using markdown headers."""

import os
from jinja2 import Template
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter

chunk_template = Template(
    """Metadata:
{% for k, v in metadata.items() %}
{{ k }}: {{ v }}
{% endfor %}

Content:
{{ content }}
""",
    trim_blocks=True,
)


class LangChainWikiChunker:
    """
    A class for chunking Markdown wiki files using LangChain text splitters.
    """
    # TODO Update default chunk_size and chunk_overlap if needed
    def __init__(self, chunk_size=500, chunk_overlap=100):
        """
        Initialize the LangChainWikiChunker.

        Args:
            chunk_size (int): The size of each chunk in characters. Default is 1000.
            chunk_overlap (int): The number of overlapping characters between chunks. Default is 200.
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_file(self, file_path):
        """
        Load the content of a file.

        Args:
            file_path (str): The path to the file to be loaded.

        Returns:
            str: The content of the file.
        """
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return content

    @staticmethod
    def chunk_markdown(
        content, chunk_size=1000, chunk_overlap=200, source_filepath=None
    ):
        """
        Chunk Markdown content using header-based and recursive character-based splitting.

        Args:
            content (str): The Markdown content to be chunked.
            chunk_size (int): The size of each chunk in characters. Default is 500.
            chunk_overlap (int): The number of overlapping characters between chunks. Default is 100.
            filepath (str): The path to the file. Default is None.
        Returns:
            list: A list of chunked documents.
        """
        headers_to_split_on = [
            ("#", "H1"),
            ("##", "H2"),
            ("###", "H3"),
        ]

        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on, strip_headers=False
        )
        md_header_splits = markdown_splitter.split_text(content)

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

        chunks = text_splitter.split_documents(md_header_splits)

        for chunk in chunks:
            _headers = chunk.metadata
            chunk.metadata = {
                "Headers": _headers,
            }

        if source_filepath:
            for chunk in chunks:
                chunk.metadata["Source"] = source_filepath

        if chunks[0].page_content.startswith("<!-- "):
            return chunks[1:]

        return chunks

    def process_file(self, file_path):
        """
        Process a single Markdown file.

        Args:
            file_path (str): The path to the Markdown file.

        Returns:
            list: A list of chunks created from the Markdown file.
        """
        content = self.load_file(file_path)
        chunks = self.chunk_markdown(
            content, self.chunk_size, self.chunk_overlap, file_path
        )
        return chunks

    def process_directory(self, directory, recursive=True, ignore_toc=True):
        """
        Process all Markdown files in a directory and its subdirectories.

        Args:
            directory (str): The path to the directory containing Markdown files.
            recursive (bool): Whether to process subdirectories recursively. Default is False.
            ignore_toc (bool): Whether to ignore the table_of_contents.md file. Default is True.

        Returns:
            list: A list of all chunks created from the Markdown files.
        """
        all_chunks = []
        document_metadata = {}
        if recursive:
            for root, _, files in os.walk(directory):
                for file in files:
                    if file.endswith(".md"):
                        file_path = os.path.join(root, file)
                        if ignore_toc and file.endswith("table_of_contents.md"):
                            continue
                        chunks = self.process_file(file_path)
                        document_metadata[file_path] = {"num_chunks": len(chunks)}
                        all_chunks.extend(chunks)
        else:
            for file in os.listdir(directory):
                if file.endswith(".md"):
                    file_path = os.path.join(directory, file)
                    if ignore_toc and file.endswith("table_of_contents.md"):
                        continue
                    chunks = self.process_file(file_path)
                    document_metadata[file_path] = {"num_chunks": len(chunks)}
                    all_chunks.extend(chunks)
        return all_chunks, document_metadata

    def build_chunk_text(self, chunk):
        """
        Build the text for a chunk.

        Args:
            chunk (Document): The chunk to be processed.

        Returns:
            str: The processed chunk text.
        """
        metadata = chunk.metadata
        content = chunk.page_content

        return chunk_template.render(metadata=metadata, content=content)
