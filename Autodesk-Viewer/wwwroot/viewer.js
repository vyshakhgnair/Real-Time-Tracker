/// import * as Autodesk from "@types/forge-viewer";

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}

export function initViewer(container) {
    return new Promise(function(resolve, reject) {
        Autodesk.Viewing.Initializer({ getAccessToken }, function() {
            const config = {
                extensions: ['Autodesk.DocumentBrowser']
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    return new Promise(function(resolve, reject) {
        function onDocumentLoadSuccess(doc) {
            resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
        }

        function onDocumentLoadFailure(code, message, errors) {
            reject({ code, message, errors });
        }
        viewer.setLightPreset(0);
        Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}


export function changeBlockColor(viewer, blockName) {
    viewer.impl.sceneAfterUpdate = () => {
        const model = viewer.model;

        // Get the model's instance tree
        model.getObjectTree(function(instanceTree) {
            if (!instanceTree) {
                console.log('Loading tree, please try again.');
                return;
            }

            // Find the node ID of the block by name
            const blockNodeId = instanceTree.nodeAccess.dbIdByExternalId(blockName);

            if (blockNodeId !== undefined) {
                // Get the node's Fragments
                const fragIds = [];

                instanceTree.enumNodeFragments(blockNodeId, function(fragId) {
                    fragIds.push(fragId);
                });

                // Change the color of the Fragments (meshes) associated with the block
                fragIds.forEach(fragId => {
                    viewer.setThemingColor(fragId, new THREE.Vector4(0, 1, 0, 1)); // Green color
                });
            } else {
                alert(`Block "${blockName}" not found.`);
            }
        });

        viewer.impl.sceneAfterUpdate = null; // Clear the sceneAfterUpdate function
    };

    viewer.impl.invalidate(true);
}