# Unreal Engine Editor Python Automation Script
# Usage: Execute inside Unreal Editor to automate asset imports with standard naming.
# Example command in UE terminal: py "packages/runtime/src/unreal/import-helper.py" --file "path/to/mesh.glb" --dest "/Game/Characters"

import os
import sys
import argparse
import unreal

def import_asset(file_path, destination_path):
    if not os.path.exists(file_path):
        unreal.log_error(f"Source file does not exist: {file_path}")
        return False

    file_name = os.path.basename(file_path)
    base_name, extension = os.path.splitext(file_name)
    
    # Standard prefix convention: SM_ (Static Mesh) or SK_ (Skeletal Mesh)
    # Default to SM_ for static mesh imports unless skeletal is specified
    prefix = "SM_"
    if base_name.startswith("mesh_"):
        clean_name = base_name.replace("mesh_", "")
    else:
        clean_name = base_name
        
    asset_name = f"{prefix}{clean_name.capitalize()}"
    
    unreal.log(f"Importing {file_path} into {destination_path} as {asset_name}...")

    # Create directory if it does not exist
    unreal.EditorAssetLibrary.make_directory(destination_path)

    # Configure the Asset Import Task
    import_task = unreal.AssetImportTask()
    import_task.filename = file_path
    import_task.destination_path = destination_path
    import_task.destination_name = asset_name
    import_task.save = True
    import_task.replace_existing = True
    import_task.automated = True
    
    # Configure GLB/FBX specific import options
    # Under Unreal 5.x, Interchange Framework handles GLB automatically,
    # but we can set up standard FBX import options as fallback
    if extension.lower() in ['.fbx', '.obj', '.glb']:
        options = unreal.FbxImportUI()
        options.import_mesh = True
        options.import_as_skeletal = False # Default to Static Mesh
        options.import_materials = True
        options.import_textures = True
        options.static_mesh_import_data.combine_meshes = True
        options.static_mesh_import_data.generate_lightmap_u_vs = True
        import_task.options = options

    # Run the import task
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([import_task])
    
    # Verify the import
    full_asset_path = f"{destination_path}/{asset_name}"
    if unreal.EditorAssetLibrary.does_asset_exist(full_asset_path):
        unreal.log(f"Successfully imported asset at: {full_asset_path}")
        return True
    else:
        unreal.log_error(f"Failed to import asset at: {full_asset_path}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Unreal Engine Automation Import Utility")
    parser.add_argument("--file", required=True, help="Absolute path to the model file to import")
    parser.add_argument("--dest", required=True, help="Destination Content folder path (e.g. /Game/Characters)")
    
    # Parse arguments
    # Note: Unreal's python execution might pass extra engine arguments, so we use parse_known_args
    args, unknown = parser.parse_known_args()
    
    success = import_asset(args.file, args.dest)
    sys.exit(0 if success else 1)
