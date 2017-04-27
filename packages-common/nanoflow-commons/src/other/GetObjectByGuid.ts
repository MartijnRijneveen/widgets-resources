// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

/**
 * @param {string} entity - This field is required.
 * @param {string} objectGuid - This field is required.
 * @returns {MxObject}
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
function GetObjectByGuid(entity: string, objectGuid: string): Promise<mendix.lib.MxObject> {
    // BEGIN USER CODE
    if (!entity) {
        throw new TypeError("Input parameter 'Entity' is required.");
    }

    if (!objectGuid) {
        throw new TypeError("Input parameter 'Object guid' is required.");
    }

    return new Promise((resolve, reject) => {
        mx.data.get({
            guid: objectGuid,
            callback: object => {
                if (object) {
                    resolve(object);
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject();
                }
            }
        });
    });
    // END USER CODE
}