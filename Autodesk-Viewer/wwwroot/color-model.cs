#r "AcDbMgd.dll"
#r "AcMgd.dll"

using System;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.Geometry;
using Autodesk.AutoCAD.Runtime;

namespace BlockColorChange
{
    public class BlockColorCommands
    {
        [CommandMethod("ChangeBlockColor")]
        public void ChangeBlockColorCommand()
        {
            Document doc = Application.DocumentManager.MdiActiveDocument;
            Database db = doc.Database;

            string dwgFilePath = @"C:\Users\vysha\OneDrive\Desktop\UNNI\Saint_gobain\test\Front-wall-Block.dwg";  // Replace with your DWG file path
            string blockName = "MT 201"; // Replace with the name of the block you want to modify
            int newColorIndex = 1; // Replace with the desired color index

            // Open the DWG file
            using (Database sourceDb = new Database(false, true))
            {
                sourceDb.ReadDwgFile(dwgFilePath, FileOpenMode.OpenForReadAndAllShare, false, null);

                using (Transaction tr = sourceDb.TransactionManager.StartTransaction())
                {
                    // Open the BlockTable
                    BlockTable bt = tr.GetObject(sourceDb.BlockTableId, OpenMode.ForRead) as BlockTable;
                    if (bt != null && bt.Has(blockName))
                    {
                        ObjectId blockId = bt[blockName];

                        // Open the BlockReference
                        BlockReference blockRef = new BlockReference(Point3d.Origin, blockId);
                        blockRef.ColorIndex = newColorIndex;

                        // Add the BlockReference to the ModelSpace
                        BlockTableRecord ms = tr.GetObject(bt[BlockTableRecord.ModelSpace], OpenMode.ForWrite) as BlockTableRecord;
                        if (ms != null)
                        {
                            ms.AppendEntity(blockRef);
                            tr.AddNewlyCreatedDBObject(blockRef, true);
                        }

                        tr.Commit();
                    }
                    else
                    {
                        doc.Editor.WriteMessage("Block not found.");
                    }
                }

                // Save the modified DWG file
                sourceDb.SaveAs(dwgFilePath, DwgVersion.Current);
            }
        }
    }
}
