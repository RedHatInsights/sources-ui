export const providerForm = {
  schema: {
    "title":  "Add an Openshift Provider",
    "type":   "object",
    "properties": {
	  "name":       {"title":"Provider Name","type":"string"},
	  "description":{"title":"Description","type":"string"},
	  "url":        {"title":"URL","type":"string"},
	  "verify_ssl": {"title":"Verify SSL","type":"boolean", "default":false},
	  "user":       {"title":"User Name","type":"string","default":""},
	  "token":      {"title":"Token","type":"string", "default":""},
	  "password":   {"title": "Password", "type": "string","minlength": 6}
    },
    "required":["name", "url"]
  },
  uiSchema: {
    password: {'ui:widget': 'password'}
  },
};
