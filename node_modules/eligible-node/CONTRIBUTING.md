# eligible-node

## Contributing

To work on the library:

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Install dependencies: `npm install`
4. Fix bugs or add features. Make sure the changes pass the coding guidelines by runing: `npm run lint` or `npm run watch`
5. Write tests for your new features. For HTTP mocking [`nock`](https://github.com/pgte/nock) library is used. Nock definitions are saved in `test/fixtures` directory
6. Run test by `ELIGIBLE_API_KEY=API_KEY npm test` or `ELIGIBLE_API_KEY=API_KEY npm run coverage`
7. If all tests are passed, push to the branch (git push origin my-new-feature)
8. Create new Pull Request
