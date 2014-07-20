---
layout: post
title: "Objects Should Be Immutable"
date: 2014-06-09
tags: quality immutability
description:
  The article gives arguments about why
  classes/objects in object-oriented programming
  have to be immutable,  i.e. never modify their encapsulated state
keywords:
  - advantage of immutable object in java
  - agruments for immutable objects
  - benefit of immutable object java
  - best practices immutable
  - clone immutable object java
  - create immutable object java
  - define immutable object java
  - failure atomicity
  - failure atomicity java
  - functional thinking in java
  - how to make an objects immutable in java
  - how to make object immutable in java
  - immutability in java
  - immutability in oop
  - immutability of objects
  - immutable class java
  - immutable classes java
  - immutable java class
  - immutable java design pattern
  - immutable java example
  - immutable object design pattern java
  - immutable object exception java
  - immutable object in java example
  - immutable object in java with example
  - immutable object java
  - immutable object java example
  - immutable object javascript
  - immutable object pattern java
  - immutable objects in java api
  - immutable objects in java other than string
  - immutable objects in java string
  - java boolean object immutable
  - java change immutable object
  - java immutable date object
  - java immutable object advantage
  - java immutable object array
  - java immutable object builder
  - java immutable object cache
  - java immutable object collections
  - java immutable object constructor
  - java immutable object definition
  - java immutable object factory
  - java immutable object hashcode
  - java immutable object list
  - java immutable object performance
  - java immutable object publication
  - java immutable object reflection
  - java immutable object state
  - java immutable object thread safe
  - java immutable object types
  - java immutable object wrapper
  - java immutable value object
  - java mutable immutable object
  - list of immutable object in java
  - mutable and immutable object in java
  - mutable immutable objects java examples
  - object design
  - object immutable in java
  - object immutable java
  - object thinking
  - oop immutable objects
  - return immutable object java
  - string object immutable java
  - update immutable object java
  - why immutable
  - why immutable objects are better

discussions:
  reddit: http://www.reddit.com/r/java/comments/27o915/objects_should_be_immutable/
---

In object-oriented programming, an object is
[immutable](http://en.wikipedia.org/wiki/Immutable_object) if its state can't be
modified after it is created.

In Java, a good example of an
immutable object is [`String`](http://docs.oracle.com/javase/7/docs/api/java/lang/String.html).
Once created, we can't modify its state. We can request that it creates
new strings, but its own state will never change.

However, there are not so many immutable classes in JDK. Take,
for example, class [`Date`](http://docs.oracle.com/javase/7/docs/api/java/util/Date.html).
It is possible to modify its state using `setTime()`.

I don't know why the JDK designers decided to make these two
very similar classes differently. However, I believe that the design
of a mutable `Date` has a many flaws, while the immutable `String`
is much more in the spirit of the object-oriented paradigm.

Moreover, I think that **all classes should be immutable in
a perfect object-oriented world**. Unfortunately, sometimes,
it is technically not possible due to limitations in JVM.
Nevertheless, we should always aim for the best.

This is an incomplete list of arguments in favor of immutability:

 * immutable objects are simpler to construct, test, and use
 * truly immutable objects are always thread-safe
 * they help to avoid temporal coupling
 * their usage is side-effect free (no defensive copies)
 * identity mutability problem is avoided
 * they always have failure atomicity
 * they are much easier to cache
 * they prevent NULL references, [which are bad]({% post_url 2014/may/2014-05-13-why-null-is-bad %})

Let's discuss the most important arguments one by one.

<!--more-->

## Thread Safety

The first and the most obvious argument is that immutable objects
are thread-safe. This means that multiple threads can access the same
object at the same time, without clashing with another thread.

If no object methods can modify its state, no matter how many
of them and how often are being called parallel &mdash; they
will work in their own memory space in stack.

Goetz et al. explained the advantages of immutable objects
in more details in their very famous book
[Java Concurrency in Practice](http://www.amazon.com/gp/product/0321349601/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321349601&linkCode=as2&tag=yegor256com-20&linkId=OHVW5XBUDRTKVT46)
(highly recommended).

## Avoiding Temporal Coupling

Here is an example of temporal coupling (the code makes
two consecutive HTTP POST requests, where the second one contains HTTP body):

{% highlight java linenos=table %}
Request request = new Request("http://example.com");
request.method("POST");
String first = request.fetch();
request.body("text=hello");
String second = request.fetch();
{% endhighlight %}

This code works. However, you must remember that the first
request should be configured before the second one may happen.
If we decide to remove the first request from the script, we will
remove the second and the third line, and won't get any errors
from the compiler:

{% highlight java %}
Request request = new Request("http://example.com");
// request.method("POST");
// String first = request.fetch();
request.body("text=hello");
String second = request.fetch();
{% endhighlight %}

Now, the script is broken although it compiled without errors. This is
what temporal coupling is about &mdash; there is always some hidden
information in the code that a programmer has to remember. In this example,
we have to remember that the configuration for the first request
is also used for the second one.

We have to remember that the second request should always stay
together and be executed after the first one.

If `Request` class were immutable, the first snippet wouldn't
work in the first place, and would have been rewritten like:

{% highlight java %}
final Request request = new Request("");
String first = request.method("POST").fetch();
String second = request.method("POST").body("text=hello").fetch();
{% endhighlight %}

Now, these two requests are not coupled. We can safely remove
the first one, and the second one will still work correctly.
You may point out that there is a code duplication. Yes, we
should get rid of it and re-write the code:

{% highlight java %}
final Request request = new Request("");
final Request post = request.method("POST");
String first = post.fetch();
String second = post.body("text=hello").fetch();
{% endhighlight %}

See, refactoring didn't break anything and we still don't have
temporal coupling. The first request can be removed safely
from the code without affecting the second one.

I hope this example demonstrates that the code manipulating
immutable objects is more readable and maintainable, b
ecause it doesn't have temporal coupling.

## Avoiding Side Effects

Let's try to use our `Request` class in a new method (now it is mutable):

{% highlight java %}
public String post(Request request) {
  request.method("POST");
  return request.fetch();
}
{% endhighlight %}

Let's try to make two requests &mdash; the first
with GET method and the second with POST:

{% highlight java %}
Request request = new Request("http://example.com");
request.method("GET");
String first = this.post(request);
String second = request.fetch();
{% endhighlight %}

Method `post()` has a "side effect" &mdash; it makes changes
to the mutable object `request`. These changes are not really
expected in this case. We expect it to make a POST request and
return its body. We don't want to read its documentation just
to find out that behind the scene it also modifies
the request we're passing to it as an argument.

Needless to say, such side effects lead to bugs and
maintainability issues. It would be much better
to work with an immutable `Request`:

{% highlight java %}
public String post(Request request) {
  return request.method("POST").fetch();
}
{% endhighlight %}

In this case, we may not have any side effects.
Nobody can modify our `request` object, no matter where
it is used and how deep through the call stack it is passed by method calls:

{% highlight java %}
Request request = new Request("http://example.com").method("GET");
String first = this.post(request);
String second = request.fetch();
{% endhighlight %}

This code is perfectly safe and side effect free.

## Avoiding Identity Mutability

Very often, we want objects to be identical if their internal
states are the same. [`Date`](http://docs.oracle.com/javase/7/docs/api/java/util/Date.html)
class is a good example:

{% highlight java %}
Date first = new Date(1L);
Date second = new Date(1L);
assert first.equals(second); // true
{% endhighlight %}

There are two different objects; however, they are equal
to each other because their encapsulated states are the same.
This is made possible through their custom overloaded
implementation of `equals()` and `hashCode()` methods.

The consequence of this convenient approach being used
with mutable objects is that every time we modify
object's state it changes its identity:

{% highlight java %}
Date first = new Date(1L);
Date second = new Date(1L);
first.setTime(2L);
assert first.equals(second); // false
{% endhighlight %}

This may look natural, until you start using your
mutable objects as keys in maps:

{% highlight java %}
Map<Date, String> map = new HashMap<>();
Date date = new Date();
map.put(date, "hello, world!");
date.setTime(12345L);
assert map.containsKey(date); // false
{% endhighlight %}

When modifying the state of `date` object, we're not expecting
it to change its identity. We're not expecting to lose an entry
in the map just because the state of its key is changed. However,
this is exactly what is happening in the example above.

When we add an object to the map, its `hashCode()` returns one value.
This value is used by [`HashMap`](http://docs.oracle.com/javase/7/docs/api/java/util/HashMap.html)
to place the entry into the internal hash table.
When we call `containsKey()` hash code of the object is
different (because it is based on its internal state) and
`HashMap` can't find it in the internal hash table.

It is a very annoying and difficult to debug
side effects of mutable objects. Immutable objects avoid it completely.

## Failure Atomicity

Here is a simple example:

{% highlight java %}
public class Stack {
  private int size;
  private String[] items;
  public void push(String item) {
    size++;
    if (size > items.length) {
      throw new RuntimeException("stack overflow");
    }
    items[size] = item;
  }
}
{% endhighlight %}

It is obvious that an object of class `Stack` will be left
in a broken state if it throws a runtime exception on overflow.
Its `size` property will be incremented, while `items` won't get a new element.

Immutability prevents this problem. An object will never be
left in a broken state because its state is modified only in
its constructor. The constructor will either fail, rejecting
object instantiation, or succeed, making a valid solid object,
which never changes its encapsulated state.

For more on this subject, read
[Effective Java, 2nd Edition](http://www.amazon.com/gp/product/0321356683/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321356683&linkCode=as2&tag=yegor256com-20&linkId=CSSI3POG6ZJ3BJ6T)
by Joshua Bloch.

## Arguments Against Immutability

There are a number of arguments against immutability.

1. &ldquo;Immutability is not for enterprise systems&rdquo;.
Very often, I hear people say that immutability is a
fancy feature, while absolutely impractical in real
enterprise systems. As a counter-argument, I can only show
some examples of real-life applications that contain only immutable Java objects:
[jcabi-http](http://http.jcabi.com),
[jcabi-xml](http://xml.jcabi.com),
[jcabi-github](http://github.jcabi.com),
[jcabi-s3](http://s3.jcabi.com),
[jcabi-dynamo](http://dynamo.jcabi.com),
[jcabi-simpledb](http://simpledb.jcabi.com)
The above are all Java libraries that work solely with immutable
classes/objects. [netbout.com](https://github.com/netbout/netbout)
and [stateful.co](https://github.com/sttc/stateful) are
web applications that work solely with immutable objects.

2. &ldquo;It's cheaper to update an existing object than create a new one&rdquo;.
Oracle [thinks](http://docs.oracle.com/javase/tutorial/essential/concurrency/immutable.html)
that &ldquo;The impact of object creation is often overestimated and can
be offset by some of the efficiencies associated with immutable objects.
These include decreased overhead due to garbage collection, and the
elimination of code needed to protect mutable objects from corruption.&rdquo; I agree.

If you have some other arguments, please post them below and I'll try to comment.