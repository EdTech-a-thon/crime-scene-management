migrate((app) => {
  const teachers = new Collection({
    id: "teachers0000001",
    type: "auth",
    name: "teachers",
    listRule: "id = @request.auth.id",
    viewRule: "id = @request.auth.id",
    createRule: "",
    updateRule: "id = @request.auth.id",
    deleteRule: "id = @request.auth.id",
    passwordAuth: {
      enabled: true,
      identityFields: ["email"],
    },
  });
  app.save(teachers);

  const lessons = new Collection({
    id: "lessons00000001",
    type: "base",
    name: "lessons",
    listRule: "teacher = @request.auth.id || (published = true && shareToken = @request.query.shareToken && @request.query.shareToken != '')",
    viewRule: "teacher = @request.auth.id || (published = true && shareToken = @request.query.shareToken && @request.query.shareToken != '')",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
        min: 1,
        max: 120,
      },
      {
        name: "description",
        type: "text",
        max: 280,
      },
      {
        name: "teacher",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "teachers0000001",
        cascadeDelete: true,
      },
      {
        name: "backgroundId",
        type: "text",
        required: true,
        max: 80,
      },
      {
        name: "objects",
        type: "json",
        required: true,
        maxSize: 100000,
      },
      {
        name: "shareToken",
        type: "text",
        required: true,
        min: 20,
        max: 80,
        pattern: "^[A-Za-z0-9_-]+$",
      },
      {
        name: "published",
        type: "bool",
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_lessons_share_token ON lessons (shareToken)",
      "CREATE INDEX idx_lessons_teacher ON lessons (teacher)",
    ],
  });
  app.save(lessons);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("lessons"));
  app.delete(app.findCollectionByNameOrId("teachers"));
});
