We’re really glad you’re reading this 👏

## Instructions

### Install

Follow these steps to start contributing to this project:

* Fork the repository
* Clone it locally and install the dependencies

```console
$ git clone https://github.com/<YOUR-USERNAME>/teltonika-sdk
$ cd teltonika-sdk
$ npm install
```

### Develop

Depending on what you want to work on, run one of the following commands:

* **`dev:parser:codec8`**: Develop the Codec 8 parser
* **`dev:parser:codec8e`**: Develop the Codec 8 Extended parser
* **`dev:parser:codec12`**: Develop the Codec 12 parser
* **`dev:parser:codec14`**: Develop the Codec 14 parser
* **`dev:parser:codec16`**: Develop the Codec 16 parser
* **`dev:server:codec8e:tcp`**: Develop the Codec 8 Extended TCP server
* **`dev:server:codec8e:tls`**: Develop the Codec 8 Extended TLS server
* **`dev:server:codec12:tcp`**: Develop the Codec 12 TCP server
* **`dev:server:codec12:tls`**: Develop the Codec 12 TLS server

### Build

To build the package, run the following command:

```console
$ npm run build
```

Once you’re done, commit your changes.
Make sure the `npm run build` command runs successfully before submitting your contribution.


### Commmit

Before begin to write some code create a branch :

```console
# For a feature always namespace your branch with `feature`
$ git branch -b feature/my-super-feat

# For a hot fix always namespace your branch with `fix`
$ git branch -b fix/fix-an-big-trouble
```

This repository use [gitmoji](https://gitmoji.dev/) as commit convention. You can write commit manually or use the gitmoji-cli :

```console
$ npm install -g gitmoji-cli
```

This is an example of feature commit :

```
✨ My super feature
```


Finally send a GitHub Pull Request with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).