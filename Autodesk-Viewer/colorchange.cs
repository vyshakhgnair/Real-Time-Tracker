using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.Colors;
using System;

public class ChangeBlockColor
{
    [CommandMethod("ChangeBlockColor")]
    public void ChangeColor()
    {
        Document doc = Application.DocumentManager.MdiActiveDocument;
        Database db = doc.Database;
        Editor ed = doc.Editor;

        PromptResult blockNamePrompt = ed.GetNestedEntity("Select a block reference: ");
        if (blockNamePrompt.Status != PromptStatus.OK)
        {
            ed.WriteMessage("No valid block reference selected.");
            return;
        }

        using (Transaction trans = db.TransactionManager.StartTransaction())
        {
            ObjectId blockRefId = blockNamePrompt.ObjectId;
            BlockReference blockRef = trans.GetObject(blockRefId, OpenMode.ForWrite) as BlockReference;

            if (blockRef != null)
            {
                // Change the color of the block reference
                blockRef.Color = Color.FromRgb(255, 0, 0); // Red color

                trans.Commit();
                ed.WriteMessage("Block color changed.");
            }
            else
            {
                ed.WriteMessage("Selected entity is not a block reference.");
            }
        }
    }
}
