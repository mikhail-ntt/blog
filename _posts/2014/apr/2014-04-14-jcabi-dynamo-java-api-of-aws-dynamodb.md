---
layout: post
title: "Object-Oriented DynamoDB API"
date: 2014-04-14
tags: dynamodb aws java jcabi
description:
  I created jcabi-dynamo a few months ago to make AWS SDK more object oriented;
  the article explains why jcabi-dynamo is better than bare Amazon SDK
keywords:
  - dynamodb
  - dynamodb java
  - java dynamodb example
  - java dynamodb query
  - java dynamodb client
  - java dynamodb query example
  - java dynamodb create table
  - java api dynamodb
  - object oriented dynamodb java
---

{% badge http://img.jcabi.com/logo-square.svg 64 http://dynamo.jcabi.com %}

I'm a big fan of cloud computing in general and of [Amazon Web
Services](http://aws.amazon.com/) in particular. I honestly believe that in a
few years big providers will host all, or almost all, computing and storage
resources. When this is the case, we won't have to worry too much anymore about
downtime, backups and system administrators.
[DynamoDB](http://aws.amazon.com/dynamodb/) is one of the steps towards this
future.

<blockquote class="twitter-tweet" lang="en"><p>This looks cool - jcabi-dynamo - a <a href="https://twitter.com/search?q=%23Java&amp;src=hash">#Java</a> Object layer atop the <a href="https://twitter.com/search?q=%23DynamoDB&amp;src=hash">#DynamoDB</a> SDK - <a href="http://t.co/khRFR2joKX">http://t.co/khRFR2joKX</a> <a href="https://twitter.com/search?q=%23aws&amp;src=hash">#aws</a></p>&mdash; Jeff Barr (@jeffbarr) <a href="https://twitter.com/jeffbarr/statuses/380813867971915777">September 19, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

DynamoDB is a [NoSQL](http://en.wikipedia.org/wiki/NoSQL) database accessible
through [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer)
JSON API. Its design is relatively simple. There are tables, which basically
are collections of data structs, or in AWS terminology, "items."

Every item has a mandatory "hash," an optional "range" and a number of other
optional attributes. For instance, take the example table `depts`:

{% highlight text %}
+------+--------+---------------------------+
| dept | worker | Attributes                |
+------+--------+---------------------------+
| 205  | Jeff   | job="manager", sex="male" |
| 205  | Bob    | age=43, city="Chicago"    |
| 398  | Alice  | age=27, job="architect"   |
+------+--------+---------------------------+
{% endhighlight %}

For Java, Amazon provides an
[SDK](https://aws.amazon.com/documentation/sdkforjava/), which mirrors all
RESTful calls to Java methods. The SDK works fine, but is designed in a pure
[procedural](http://en.wikipedia.org/wiki/Procedural_programming) style.

Let's say we want to add a new item to the table above. RESTful call
[`putItem`](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html)
looks like (in essence):

{% highlight text %}
putItem:
  tableName: depts
  item:
    dept: 435
    worker: "William"
    job: "programmer"
{% endhighlight %}

This is what the Amazon server needs to know in order to create a new item in
the table. This is how you're supposed to make this call through the AWS Java
SDK:

{% highlight java linenos=table %}
PutItemRequest request = new PutItemRequest();
request.setTableName("depts");
Map<String, AttributeValue> attributes = new HashMap<>();
attributes.put("dept", new AttributeValue(435));
attributes.put("worker", new AttributeValue("William"));
attributes.put("job", new AttributeValue("programmer));
request.setItem(attributes);
AmazonDynamoDB aws = // instantiate it with credentials
try {
  aws.putItem(request);
} finally {
  aws.shutdown();
}
{% endhighlight %}

The above script works fine, but there is one major drawback &mdash; it is not
object oriented. It is a perfect example of an imperative [procedural
programming](http://en.wikipedia.org/wiki/Procedural_programming).

To allow you to compare, let me show what I've done with
[jcabi-dynamo](http://dynamo.jcabi.com). Here is my code, which does exactly the
same thing, but in an
[object-oriented](http://en.wikipedia.org/wiki/Object-oriented_programming) way:

{% highlight java linenos=table %}
Region region = // instantiate it with credentials
Table table = region.table("depts");
Item item = table.put(
  new Attributes()
    .with("dept", 435)
    .with("worker", "William")
    .with("job", "programmer")
);
{% endhighlight %}

<!--more-->

My code is not only shorter, but it also employs encapsulation and separates
responsibilities of classes.
[`Table`](http://dynamo.jcabi.com/apidocs-0.10/com/jcabi/dynamo/Table.html)
class (actually it is an interface internally implemented by a class)
encapsulates information about the table, while
[`Item`](http://dynamo.jcabi.com/apidocs-0.10/com/jcabi/dynamo/Item.html)
encapsulates item details.

We can pass an `item` as an argument to another method and all DynamoDB related
implementation details will be hidden from it. For example, somewhere later in
the code:

{% highlight java %}
void sayHello(Item item) {
  System.out.println("Hello, " + item.get("worker"));
}
{% endhighlight %}

In this script, we don't know anything about DynamoDB or how to deal with its
RESTful API. We interact solely with an instance of
[`Item`](http://dynamo.jcabi.com/apidocs-0.10/com/jcabi/dynamo/Item.html) class.

By the way, all public entities in [jcabi-dynamo](http://dynamo.jcabi.com) are
Java interfaces. Thanks to that, you can test and mock the library completely.

Let's consider a more complex example, which would take a page of code if we
were to use a bare AWS SDK. Let's say that we want to remove all workers from
our table who work as architects:

{% highlight java %}
Region region = // instantiate it with credentials
Iterator<Item> workers = region.table("depts").frame()
  .where("job", Condition.equalTo("architect"));
while (workers.hasNext()) {
  workers.remove();
}
{% endhighlight %}

[jcabi-dynamo](http://dynamo.jcabi.com) has saved a lot of code lines in a few
of my projects. You can see it in action at
[rultor-users](https://github.com/rultor/rultor/tree/rultor-0.2/rultor-users/src/main/java/com/rultor/users).

The library ships as a JAR dependency in [Maven
Central](http://repo1.maven.org/maven2/com/jcabi/jcabi-dynamo)
(get its latest versions from [Maven Central](http://search.maven.org/)):

{% highlight xml %}
<dependency>
  <groupId>com.jcabi</groupId>
  <artifactId>jcabi-dynamo</artifactId>
</dependency>
{% endhighlight %}
