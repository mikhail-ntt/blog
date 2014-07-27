---
layout: post
title: "Rultor.com, Merging Bot"
date: 2014-07-24
tags: rultor ci
description:
  Rultor.com is a bot that talks to you via Github
  issue tracking and helps you merge pull requests by
  passing them through a full testing cycle
keywords:
  - docker continuous integration
  - pre-flight builds
  - pre-flight builds docker
  - preflight builds
  - preflight builds docker
  - continuous integration pre-flight builds
  - continuous integration preflight builds
  - continuous delivery pre-flight builds
  - continuous delivery preflight builds
  - build before merge
  - merging pull request docker
  - github pull request docker
  - continous delivery docker
  - builds in docker containers
  - jenkins pre-flight builds
  - jenkins preflight builds
---

{% badge http://img.rultor.com/logo.svg 100 http://www.rultor.com %}

You get a Github pull request. You review it. It looks correct &mdash; it's time
to merge it into `master`. You post a comment in it, asking
[@rultor](https://github.com/rultor) to test and merge. Rultor starts a new
[Docker](http://www.docker.io) container, merges the pull request into `master`, runs all tests and, if
everything looks clean &mdash; merges, pushes, and closes the request.

Then, you ask [@rultor](https://github.com/rultor) to deploy the current version
to production environment. It checks out your repository, starts a new Docker
container, executes your deployment scripts and reports to you right there in
the Github issue.

<!--more-->

## Why not Jenkins or Travis?

There are many tools on the market, which automate continuous integration and
continuous delivery. For example, downloadable open-source [Jenkins](http://www
.jenkins-ci.org) and hosted [Travis](http://travis-ci.org) both perform these
tasks. So, why do we need one more?

Well, there are three very important features that we need for our projects, but
we can't find all of them in any of the CI tools currently available on the
market:

 * **Merging**. We make master branch read-only in our projects,
   as [this article]({% post_url 2014/jul/2014-07-21-read-only-master-branch %})
   recommends. All changes into master we pass through
   a script that validates them and merges.

 * **Docker**. Every build should work in its own
 Docker container, in order to simplify configuration, isolate
 resources and make errors  easily reproduceable.

 * **Tell vs. Trigger**. We need to communicate with CI tool
 through commands, right from our issue tracking system (Github
 issues, in most   projects). All existing CI systems trigger
 builds on certain   conditions. We need our developers to be able
 to talk to the tool, through human-like commands in the tickets they are working with.

A combination of these three features is what differs
[Rultor](http://www.rultor.com) from all other existing systems.

## How Rultor Merges

Once Rultor finds a [merge command](http://doc.rultor.com/basics.html)
in one of your Github pull requests, it does exactly this:

 1. Reads the [`.rultor.yml`](http://doc.rultor.com/reference.html)
 YAML config file from the root directory of your repository.

 2. Gets automated build execution command from it, for example `bundle test`.

 3. Checks out your repository into a temporary directory on one of its servers.

 4. Merges pull request into `master` branch.

 5. Starts a new Docker container and runs `bundle test` in it.

 6. If everything is fine, pushes modified `master` branch to Github.

 7. Reports back to you, in the Github pull request.

You can see it in action, for example, in this pull request:
[jcabi/jcabi-github#878](https://github.com/jcabi/jcabi-github/pull/878).