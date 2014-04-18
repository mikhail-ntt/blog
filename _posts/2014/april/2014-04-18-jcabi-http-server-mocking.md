---
layout: post
title: "Mocking of HTTP Server in Java"
date: 2014-04-18
tags: cloud
description:
  HTTP server mocking in Java unit and integration
  testing is easy and flexible with jcabi-http
keywords:
  - java http server
  - java http client
  - http server mock
  - java http server mock
  - mock java http server
---

<img src="http://img.jcabi.com/logo-square.png"
  style="width: 64px; height:64px; float: right; margin-left: 2em;"/>

Recently, I explained a
[fluent Java HTTP client]({% post_url 2014/april/2014-04-11-jcabi-http-intro %})
created (mostly) to make HTTP
interactions more object-oriented than with other available clients,including:

[Apache Client](http://hc.apache.org/httpclient-3.x/),
[Jersey Client](https://jersey.java.net/documentation/latest/client.html)
and plain old
[`HttpURLConnection`](http://docs.oracle.com/javase/7/docs/api/java/net/HttpURLConnection.html).

This client ships in the [jcabi-http](http://http.jcabi.com) Maven artifact.
However, the client part is not the only benefit of using
[jcabi-http](http://http.jcabi.com). Jcabi also includes a server component that
can help you in unit and integration testing of your HTTP clients.

Let me show you an example first. In the example, I'm using
[hamcrest](http://hamcrest.org/JavaHamcrest/) for assertions.

{% highlight java linenos=table %}
MkContainer container = new MkGrizzlyContainer()
  .next(new MkAnswer.Simple("hello, world!"))
  .start();
try {
  new JdkRequest(container.home())
    .header("User-agent", "Myself")
    .fetch()
    .assertBody(Matchers.containsString("hello"));
} finally {
  container.stop();
}
MkQuery query = container.take();
MatcherAssert.assertThat(
  query.headers().get("User-agent"),
  Matchers.hasItem("Myself")
);
{% endhighlight %}

Now, let's discover what happens here.

In the first few lines, I create an instance of
[`MkContainer`](http://http.jcabi.com/apidocs-1.1/com/jcabi/http/mock/MkContainer.html),
which literally has four methods: `next(MkAnswer)`, `start()`, `stop()`, and
`home()`.

It works as an HTTP server with a "first-in-first-out" queue for HTTP answers.
We add answers, and the server returns them in response to HTTP requests.

The server starts on `start()` call and stops on `stop()`. Its method `home()`
returns a URL of its "home page". The server then binds itself to a randomly
allocated TCP port.

The container finds the first available and unoccupied port.

In the example above, I added just one answer. This means that the container
will reply only to the first HTTP request with that answer and that all
consecutive requests will cause HTTP responses with status "internal server
errors."

[500](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

In lines 5 through 8, I make an HTTP request to the already started server.
Also, I make an assertion that the body of the HTTP response contains the text
`"hello"`. Obviously, this assertion will pass because the server will return
`"hello, world!"` to my first request:

{% highlight java %}
new JdkRequest(container.home())
  .header("User-agent", "Myself")
  .fetch()
  .assertBody(Matchers.containsString("hello"));
{% endhighlight %}

As you can see, I use `container.home()` in order to get the URL of the server.
It is recommended that you allow the container to find the first unoccupied TCP
port and bind itself to it. Nevertheless, if you need to specify your own port,
you can do it with a one-argument in `MkContainer`:

[`start(int)`](http://http.jcabi.com/apidocs-1.3/com/jcabi/http/mock/MkContainer.html#start%28int%29)

I use `try/finally` to stop the container safely. In unit tests, this is not
critical, as you can simplify your code and never stop the container. Besides,
the container will be killed together with the JVM. However, for the sake of
clarity, I would recommend you stop the container in the `finally` block.

On line 12, I ask the stopped container to give me the first request it
received. This mechanism is similar conceptually to the "verify" technology of
mocking frameworks. For example, take the following.
[Mockito](http://docs.mockito.googlecode.com/hg/org/mockito/Mockito.html#4):

{% highlight java %}
MkQuery query = container.take();
MatcherAssert.assertThat(
  query.headers().get("User-agent"),
  Matchers.hasItem("Myself")
);
{% endhighlight %}

An instance of
[`MkQuery`](http://http.jcabi.com/apidocs-1.3/com/jcabi/http/mock/MkQuery.html)
exposes information about the query made. In this example, I get all headers of
the HTTP request and making an assertion that the`"User-Agent"` header was there
and had at least one value equal to `"Myself"`.

This mocking technology is used actively in unit and integration tests of
[jcabi-github](http://github.com/jcabi/jcabi-github), which is a Java client to
Github API. In its development, the technology is very important in checking
which requests are being sent to the server and validating whether they comply
with our requirements. Here, we are using [jcabi-http](http://http.jcabi.com)
mocking.

As with the client, you need the
[jcabi-http.jar](`http://repo1.maven.org/maven2/com/jcabi/jcabi-http`)
dependency:

{% highlight xml %}
<dependency>
  <groupId>com.jcabi</groupId>
  <artifactId>jcabi-http</artifactId>
  <version><!-- check http://http.jcabi.com --></version>
</dependency>
{% endhighlight %}

Besides the above, you need to add one more dependency, which is a Grizzly HTTP
server.
[`MkGrizzlyContainer`](http://http.jcabi.com/apidocs-1.3/com/jcabi/http/mock/MkGrizzlyContainer.html)
is based on it.

{% highlight xml %}
<dependency>
  <groupId>com.sun.grizzly</groupId>
  <artifactId>grizzly-servlet-webserver</artifactId>
  <version>1.9.59</version>
  <scope>test</scope>
</dependency>
{% endhighlight %}

If you have any questions or suggestions, please submit them through [Github
issues](http://github.com/jcabi/jcabi-http/issues).

As always, bugs are welcome :)