declare namespace NodeJS {
  interface Global {
    //https://stackoverflow.com/a/51114250
    //para sobrescrever global é necessário o import inline
    testRequest: import('supertest').SuperTest<import('supertest').Test>
  }
}
