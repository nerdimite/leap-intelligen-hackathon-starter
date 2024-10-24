from vector_db import VectorDB


def run_ingestion():
    vector_db = VectorDB("lancedb", "wiki")
    vector_db.ingest_directory("wiki")

    print(f"Table Contains {len(vector_db.table.to_arrow().to_pylist())} rows")


if __name__ == "__main__":
    run_ingestion()
