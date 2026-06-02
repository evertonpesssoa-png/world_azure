import os

BASE_DIR = "/storage/emulated/0/hecate"

def print_tree(path, prefix=""):
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        return

    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        is_last = i == len(items) - 1

        connector = "└── " if is_last else "├── "
        print(prefix + connector + item)

        if os.path.isdir(full_path):
            extension = "    " if is_last else "│   "
            print_tree(full_path, prefix + extension)

print("\n📂 ESTRUTURA COMPLETA DO PROJETO:\n")
print(BASE_DIR)
print_tree(BASE_DIR)