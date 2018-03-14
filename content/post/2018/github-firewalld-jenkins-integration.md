---
title: "Github integration with Jenkins behind firewall"
date: 2018-03-13T15:19:54+02:00
draft: false
tags: ["github", "jenkins", "aws"]
---
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

# TL;DR

This post will explain how to trigger a job on Jenkins that will test changes
on Github repository when Jenkins is behind a firewall. 
Github has service integration with Amazon SQS and Jenkins has a plugin that
triggers a job on SQS event. To make it work you will need to do the following:

1. Create Amazon SQS for your Github repository and configure it
2. Add SQS to Github and configure it to notify on push and pull requests
3. Install SQS plugin and configure it in Jenkins
4. Write pipeline job that will handle the different events
5. Post job results to Github branch or pull request

# Amazon SQS

"Amazon Simple Queue Service (SQS) is a fully managed message queuing service",
in other words SQS it will be our message bus, where we send messages from
Github and listen to them on Jenkins. Jenkins will have to connect to SQS
(outbond connection) and not listen to inbound connections.
To get started, you need an AWS account and then you can create a new SQS service
like this:

1. Go to [AWS SQS console][1]
2. Click on `Create New Queue`, and then:
    - What do you want to name your queue?
      {{%tip "Whatever you want"%}}__Repository name__{{%/tip%}}
    - {{%tip "I think it will work well for most cases"%}}What type of queue do you need?{{%/tip%}} __Standard Queue__
3. {{%tip "We will configure it later"%}}Click on `Quick-Create-Queue`{{%/tip%}}
4. Select the queue you've just created and at the bottom copy for later:
    - `ARN`
    - `URL`

Next we will create a new IAM user for Jenkins:

1. Go to [IAM console][2]
2. Click on `Add user`, and then:
    - User name: {{%tip "whatever you want"%}}__jenkins__{{%/tip%}}
    - Access type: _Programmatic access_
3. Click on `Next:Permissions`, and then:
    a. Select `Attach existing policies directly`
    b. In the _Filter_ search for `AmazonSQSFullAccess`
4. Click on `Next:Preview` and then Click on `Create user`
5. {{%tip "You will need it for Jenkins and Github integration"%}}Copy the `Access Key ID` and `Secret access key`{{%/tip%}}

That's it, you have SQS configured.

# Github

Github has a great support for webhooks and services, and there is even a one
for Jenkins. But all of them assume Github can reach your Jenkins. Fortunately
Github also has a service for Amazon SQS:

1. Go to your repository services: `https://github.com/<user>/<repo>/settings/installations`
2. Click on `Add service`, then find and select __Amazon SQS__
3. Click on __Amazon SQS__ service to configure it, and then:
    - Aws access key - IAM user `Access Key ID`
    - Aws sqs arn - SQS queue `ARN`
    - Aws secret key - IAM user `Secret access key`
4. Update service
5. Open your terminal:

    a. Find the service id:
    {{< highlight bash >}}
    curl -u <user> https://api.github.com/repos/<user>/<repo>/hooks
    {{</highlight>}}

    b. Modify on which events the service will trigger:
    {{< highlight bash >}}
    curl -X PATCH --data '{ "events": ["push", "pull_request"] }' -u <user> 'https://api.github.com/repos/<user>/<root>/hooks/<id>'
    {{</highlight>}}

Github will now send messages on push and pull request to your Amazon SQS queue.
You can find what other events can be added and the messages content at [Github
documentation on web-hooks and events][3].

# Jenkins

Jenkins has a vast collection of open source plugins and even two for Amazon
SQS. You will need only one of them and a pipeline support:

1. Go to Jenkins Plugin manager: `http://<jenkins FQDN>/pluginManager/available`
2. Install {{% tip "version 2.0.1" %}}`￼AWS SQS Build Trigger Plugin`{{%/tip%}}
3. Go to Jenkins configuration: `http://<jenkins FQDN>/configure`
4. In section __Configuration of Amazon SQS queues__ click on `Add`, then:

    a. Credentials: Click on `Add` and select __Jenkins__, then:
        - Kind: __Secret Text__
        - Scope: __Global__
        - Secret: IAM user's `Secret access key`
        - ID: IAM user's `Access Key ID`
    b. Queue name: Queue `URL`
    c. Click on `Test access`, you should see: "Access to \<queue\> successful"
5. Click on `Save` 

Create a new {{<tip "should work with other too">}}Pipeline job{{</tip>}} with
the following setting:

- In section __Build Triggers__:
    * mark:
    'Trigger build when a message is published to an Amazon SQS queue' 
    * SQS queue to monitor: \<queue\>
- In section __Pipeline__, use `Pipeline script` and you can use this as template
for your job:
{{<tip "click to expand/collapse">}}
{{%expand "Pipeline template" %}}
{{< gist abraverm b702bc7fbdca6736b4ffc55f03e7929e >}}
{{%/expand%}}
{{</tip>}}
    * Lines 11-36 function for commenting on Github:
        - Install python library `PyGithub` on the executing system
        - Create Access token in Github for your user (or a bot user)
        - Set global parameter in Jenkins `GITHUB_ACCESS_TOKEN`
    * Lines 38-61 function for cloning and checking out the right repository
        based on the SQS message from Github.
    * Lines 69-73 will handle parameters from SQS trigger, the most important is `sqs_body`
    * Lines 76-87 will prepare everything you need for the job to work

[1]: https://console.aws.amazon.com/sqs
[2]: https://console.aws.amazon.com/iam
[3]: https://developer.github.com/webhooks/#events
