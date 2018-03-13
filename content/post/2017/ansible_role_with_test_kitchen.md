+++
categories = ["development"]
date = "2017-05-26T23:20:41+03:00"
description = "Ansible role development and testing with Test Kitchen in upstream"
draft = false
images = []
publishdate = "2017-06-05T22:23:31+03:00"
tags = ["ansible","test kitchen","travis-ci"]
title = "Ansible role with Test Kitchen"
toc = true

+++

I've started working on a new Ansible role, and this is the first upstream
project that I feel like to be responsible of. As a DevOps engineer it is
important for me to build a good CI, both for upstream and downstream, for
development and testing. With the tools I believe in, I started building the CI
of the Ansible role, and I was surprised that it was a bit different from
anything else on the net. I would like to share with you **how to built upstream
CI for Ansible role with Test Kitchen**.

## Ansible Role

> Roles are ways of automatically loading certain vars_files, tasks, and
handlers based on a known file structure. Grouping content by roles also allows
easy sharing of roles with other users. Roles are just automation around
‘include’ directives as described above, and really don’t contain much
additional magic beyond some improvements to search path handling for
referenced files.

In other words, Ansbile role is just a complicated playbook for specific task.
For example [installing and configuring a service such as Logstash][5].
Ansible role sharing is mostly done with Ansible Galaxy tool, if it by [specifying
the Git repository of the role][7], or from [published version in the web][6].
By keeping variables managed outside the role, its quite possible to share many
of the roles with the community. But working with other people require a common
baseline of discussion, and that's why testing is critical. Local testing has
to be easy and fast to not hold the developer and at the same breath legitimize
the work being done. Upstream testing is trusting a third party on the changes
being submitted based on agreed testing.

## Test Kitchen

> [Test Kitchen][1] is an integration tool for developing and testing
infrastructure code and software on isolated target platforms.

In other words, Test Kitchen is a testing framework for configuration management.

### How it works

Example Test Kitchen configuration file `.kitchen.yml`:

```yaml

---
driver:
  name: docker

provisioner:
  name: ansible

platforms:
  - name: ubuntu-14.04
  - name: fedora-25

verifier:
  name: inspec

suites:
  - name: use_case_1
  - name: use_case_2
```

Test Kitchen will create a test matrix:

 - ubuntu-14.04-use_case_1
 - ubuntu-14.04-use_case_2
 - fedoar-25-use_case_1
 - fedoar-25-use_case_2

For each test, kitchen will do:

1. deploy a docker container for the specified platform
2. Apply playbook of specified use case
3. Verify the results with Inspec for that use case

### Why is it a very good CI framework

First of all, Test kitchen implements all [best practices of Continuous
Integration][2] in my opinion but I think there is more to it:

 - **Local development vs Remote verification** - One of the most common
 problems I hear from engineers is the difficulty of testing their changes just
 the same as integration system, Jenkins for example. And it more annoys them
 when it works locally but not in the shared testing environment. Test Kitchen
 handles this problem by letting the engineer use **same infrastructure**.
 Test Kitchen has many plugins that support different infrastructures, called
 'driver', local such as Docker or remote (clouds) such as OpenStack.
 In downstream, company internal, development it is better to use private clouds
 where as developer you are focused on development, and the company is focused
 on providing the infrastructure. Also, developers can share test environment
 for investigation. For upstream, public projects, using local based
 infrastructure such as Docker or Vagrant is a slim way for describing the
 testing environment and free from system dependency such as versions. Later
 in the post I will show how to make Test Kitchen work with public CI system -
 Travis-CI.
 - **Plugin based architecture** - It seem obvious, but the fact that Test
 Kitchen architecture is plugin based, makes it flexible to CI world. It means
 for the maintainer to be able to adjust his CI to the needs of the project.
 But also to reuse the framework in other project with different needs.
 There are cases where company might decide to refactor the automation to another
 language such as from scripts to configuration management with common test process.
 - **Dynamic test framework** - One of the less known features of Test Kitchen,
 is that the configuration file is actually compiled prior to loading. The file
 is compiled with [ERB][4], which allows the configuration to be adjusted to its
 environment.
 - **Shared tests** - Using Inspec for verifying the deployment will allow you
 to load testing [profiles][3] from remote repositories, this will allow setting
 testing standards cross project.


## Travis-CI

As mentioned above, upstream projects need to be tested by a third party and
one popular system is [Travis-CI][8] which offers free CI for open source
projects, and [integrates very well with GitHub][9]. The most important feature
it has for Ansible is [Docker container service][10]. The service allows building
Docker images and running containers in a single job. This will be the common
ground for Test Kitchen (local CI) and Travis-CI (public CI). Travis also allows
running [matrix testing], when the focus is the language version and a set of
environment variables. For Ansible the language is Python, but we can consider
Ansible version as a factor for testing the module. With that you will have
matrix testing of (Ansible version)x(Platform)x(use case). Unfortunately there
is no working out of the box Ansible version manager/switcher, except maybe with
Python virtualenv.

## Template

Best examples are the one being used, so checkout my [logstash role][5] for
complete solution, or download the [template from GitHub][12]. The following
is a detailed cover of the template structure.

The file structure of the template:

```bash
.
├── .gitignore
├── .kitchen.yml
├── .travis.yml
├── defaults
│   └── main.yml
├── Gemfile
├── handlers
│   └── main.yml
├── LICENSE
├── meta
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
├── test
│   ├── ansible.cfg
│   ├── init_scripts
│   │   └── fedora
│   └── integration
│       └── default
│           ├── ansible
│           │   └── playbook.yml
│           ├── controls
│           │   └── my_role_spec.rb
│           └── inspec.yml
└── vars
    └── main.yml
```

### Ansible role

Ansible role has a default file structure that you can start with by running
`ansible-galaxy init <name of the module>`. It will create a directory with
the name of the module, and the following file structure:

```bash
.
├── defaults
│   └── main.yml
├── handlers
│   └── main.yml
├── meta
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
├── tests
│   ├── inventory
│   └── test.yml
└── vars
    └── main.yml
```

When using Test Kitchen, you don't need 'tests' directory, because it looks
for 'test' directory and different file structure in it.

> Note: it is highly recommended to maintain 'meta/main.yml' well as its
critical for ansible-galaxy tool and for publishing to Ansible Galaxy.

Other information on Ansible role development and structure you will find in
Ansible documentation.

### Test Kitchen

Test Kitchen consists of three main parts:

 - Gemfile - preparing your system to run Test Kitchen
 - .kitchen.yml - how Test Kitchen is executed
 - tests/ - the tests that will be executed by Test Kitchen

Gemfile is used by a tool named [`bundler`][12] to install gems, which are ruby
libraries. In our case, the Gemfile will look like this:

```ruby
source 'https://rubygems.org'

gem 'test-kitchen'
gem 'inspec'
gem 'kitchen-docker'
gem 'kitchen-inspec'
gem 'kitchen-ansiblepush'
```

So your automation and users can prepare their environment by just running
`bundle install`. Gemfiles can be much more complex to cover different cases
and it designed for developers to clarify what required of the ruby environment.
I also believe in simplicity, so don't over complicate this file until you need
to.

Next is the `.kitchen.yml` file that used by Test Kitchen how exactly to run
things and it will look similar to this:


```yaml

---
driver:
  name: docker
  socket: unix:///var/run/docker.sock
  privileged: true
  use_sudo: false
  hostname: "simple"

provisioner:
  name: ansible_push
  chef_bootstrap_url: nil
  ansible_config: "test/ansible.cfg"
  idempotency_test: true
  diff: true

platforms:
  - name: fedora-25
    driver:
      run_command: /start
      run_options: --tty -e 'container=docker'
      provision_command:
        - dnf install -y python systemd python2-dnf
      volume:
        - $PWD/test/init_scripts/fedora:/start:ro
        - /sys/fs/cgroup:/sys/fs/cgroup:ro

verifier:
  name: inspec

suites:
  - name: default
    provisioner:
      playbook: "test/integration/default/ansible/playbook.yml"

  - name: configured
    provisioner:
      playbook: "test/integration/configured/ansible/playbook.yml"
```

I don't have really power at the moment explaining all the bits and bolts of
what it does, so if you have question, feel free to comment, write me
an email, or ping me on IRC. I promise to answer and add it here.
But here is the key points:

 - Test Kitchen will use Docker as the backend for testing environment. It will
 run against different Docker images (platforms), in this case only fedora-25.
 The image is rather minimal and some modifications are needed. I feel they
 are small enough to not be in a Dockerfile. The reason I choose Docker, is
 because its light, easy to distribute and can run on developer environment and
 CI environment (Travis) and it has a very large community.
 - Ansible is __usually__ push driven, meaning, Ansible is executed locally and does
 things on remote target. Also not every environment will able to install Ansible
 to be executed in it. That's why Test Kitchen should use the 'ansible_push'
 provisioner and not 'ansible'. Last, this will allow you to test the role with
 different versions of Ansible in Travis, as I will show you later on.
 - Every test case is called 'suite' in Test Kitchen, and the default path for
 needed files are at `test/integration/<suite name>`. I thought a good place
 to put ansible playbook at `test/integration/<suite name>/ansible/playbook.yml`.
 In the suite directory you will find verification tool files, for inspec it
 will be `inspec.yml` and `controls\something_spec.rb`. Read Inspec documentation
 on how to verify your playbooks.

Last, the `test/` directory... oh wait I just covered it in the last key point
above. But I did forget to mention that I also used it to store other files:
 - `ansible.cfg` - used by ansible_push to find the ansible role:

```
   [defaults]
   roles_path=../:../../:/spec/
```

 - `init_scripts` - scripts used by Docker as the commands to start
 the container with, for example to make systemd to work in the container.

So basically feel free to put anything related to Test Kitchen in tests
directory.

When you run Test Kitchen, it might create all sort of temporary files, make
sure to avoid polluting your Git repository with `.gitignore`:

```
Gemfile.lock
.kitchen
**/*.retry
```

### Travis-CI

After you [get started with Travis][9] and connect your GitHub to it, here is an
example of `.travis.yml` for you:

```yaml

---
sudo: required
services:
  - docker

language: python
python: "2.7"

env:
  - ANSIBLE_VERSION=latest
  - ANSIBLE_VERSION=2.3.0.0
  - ANSIBLE_VERSION=2.2.0.0
  - ANSIBLE_VERSION=2.1.0.0

cache: pip

before_install:
  # Make sure everything's up to date.
  - sudo apt-get update -qq
  - sudo apt-get install -qq python-apt python-pycurl git python-pip ruby ruby-dev build-essential autoconf
  - gem install bundler

install:
  # Install Test Kitchen and its dependencies
  - bundle install

  # Install Ansible
  - if [ "$ANSIBLE_VERSION" = "latest" ]; then pip install ansible; else pip install ansible==$ANSIBLE_VERSION; fi

script:
  - export ANSIBLE_CONFIG="test/ansible.cfg"
  - ansible --version
  - docker version
  - sudo locale-gen en_US.UTF-8
  - bundle show
  - LANG=en_US.UTF-8 bundle exec kitchen --version
  - LANG=en_US.UTF-8 bundle exec kitchen test -d always

after_success:
  - echo "Success"

notifications:
  webhooks: https://galaxy.ansible.com/api/v1/notifications/
```

I think most of it speaks for it self, but as I mentioned earlier, the beauty in
this case is cross Ansible version testing with the 'env' section. You can also
have cross python validation, and it costs you nothing, but I don't feel like
its really needed at the beginning. Travis has many more features like awesome
notifications but this is really a good starting point IMHO.


[1]: http://kitchen.ci/
[2]: https://en.wikipedia.org/wiki/Continuous_integration#Best_practices
[3]: https://www.inspec.io/docs/reference/profiles/
[4]: https://apidock.com/ruby/ERB
[5]: https://github.com/abraverm/ansible-logstash
[6]: http://docs.ansible.com/ansible/galaxy.html#id3
[7]: http://docs.ansible.com/ansible/galaxy.html#version
[8]: https://travis-ci.org/
[9]: https://travis-ci.org/getting_started
[10]: https://docs.travis-ci.com/user/docker/
[11]: https://docs.travis-ci.com/user/customizing-the-build#Build-Matrix
[12]: http://bundler.io/
