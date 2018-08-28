export class UUIDResolver {
  db: any
  uuid: string

  constructor(uuid: string, db: any) {
    this.db = db
    this.uuid = uuid
  }

  resolveManifest()  {
    return this.db.ref('/manifestMap/' + this.uuid).once('value')
      .then((snapshot) => {
          return snapshot.val().manifest
        },
      )
  }
}
