import { UiSchema } from "react-jsonschema-form";

interface NestedObject {
  [key: string]: any; // Add index signature
}

export const separateUiSchema = (nestedObj: NestedObject, uiSchemaObj: UiSchema = {}): UiSchema => {
  const uiSchema: UiSchema = uiSchemaObj;

  for (const [key, value] of Object.entries(nestedObj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      uiSchema[key] = {};
      if (value.ui) {
        uiSchema[key] = value.ui;
      }
      if (value.items) {
        uiSchema[key].items = Array.isArray(value.items) ? [] : {};
        if (value.items.properties) {
          separateUiSchema(value.items.properties, uiSchema[key].items);
        } else {
          separateUiSchema(value.items, uiSchema[key].items);
        }
      }
      if (value.properties) {
        separateUiSchema(value.properties, uiSchema[key]);
      }
    }
  }
  return uiSchema;
};
