"use strict";

const build = require('./build');
const packageJson = require('../../package');

const APP_DB_VERSION = 83;

module.exports = {
    app_version: packageJson.version,
    dbVersion: APP_DB_VERSION,
    build_date: build.build_date,
    build_revision: build.build_revision
};