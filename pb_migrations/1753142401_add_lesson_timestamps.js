migrate((app) => {
  const lessons = app.findCollectionByNameOrId("lessons");
  lessons.fields.add(new AutodateField({
    name: "created",
    onCreate: true,
  }));
  lessons.fields.add(new AutodateField({
    name: "updated",
    onCreate: true,
    onUpdate: true,
  }));
  app.save(lessons);
}, (app) => {
  const lessons = app.findCollectionByNameOrId("lessons");
  lessons.fields.removeByName("created");
  lessons.fields.removeByName("updated");
  app.save(lessons);
});
