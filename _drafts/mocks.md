---
layout: post
title: "Fake Objects, Make Them Public"
date: 2014-09-25
tags: testing
description:
  Mocking frameworks is not a good practice and should be your last resort;
  instead, create and ship mock classes together with your code
keywords:
  - mocking is evil
  - mocks are evil
  - mocking frameworks
  - best practices of mocking
  - java mocking
  - java mock framework
  - why mocking is evil
  - mockito java
  - java mockito example
---

While mock objects is a perfect instrument for unit testing,
mocking through mock frameworks may turn your unit tests into
an unmaintanable mess. Here are a few examples of unit tests,
look at them yourself:

...

The root cause of this complexity is that our objects
are too big. They have many methods and these methods
return other objects, which also have methods. When we pass
a mock version of such an object as a parameter, we should
make sure that all of its methods return valid objects.

## Object Hierarchy

Take `Region` interface from [jcabi-dynamo](http://dynamo.jcabi.com) as an example
(this snippet and all others in this article are simplified, for the
sake of brevity):

{% highlight java %}
public interface Region {
  Table table(String name);
}
{% endhighlight %}

Its `table()` method returns an instance of `Table` interface, which
has its own methods:

{% highlight java %}
public interface Table {
  Frame frame();
  Item put(Attributes attrs);
  Region region();
}
{% endhighlight %}

Interface `Frame`, returned by `frame()` method, also has its
own methods. And so on.
In order to create a properly mocked instance of interface `Region`,
one should create a dozen of other mock objects.

## Sample Use Case

Let's say, you're developing a project that uses jcabi-dynamo for
managing data in DynamoDB. Your class may look similar to this:

{% highlight java %}
public class Employee {
  private final String name;
  private final Region region;
  public Employee(String empl, Region dynamo) {
    this.name = empl;
    this.region = dynamo;
  }
  public Integer salary() {
    return Integer.parseInt(
      this.region
        .table("employees")
        .frame()
        .where("name", this.name)
        .iterator()
        .next()
        .get("salary")
        .getN()
    );
  }
}
{% endhighlight %}

You can imagine how difficult it will be to unit test this class,
using [Mockito](http://www.mockito.org), for example. First, we have
to mock `Region` interface. Then, mock a `Table` interface and make sure
it is returned by `table()` method. Then, mock a `Frame` interface, etc.

The unit test will be much longer than the class itself. Besides that,
it's real purpose, which is to test the retrieval of employee's salary, will not
be obvious for a reader.

Moreover, when we will need to test a similar method of a similar class,
we should start this mocking from scratch. Again, multiple lines of code,
which will look very similar to what we have written before.

## Fake Classes

The solution is to create fake classes and ship them
together with real classes. This is what [jcabi-dynamo](http://dynamo.jcabi.com)
is doing, look at its [JavaDoc](http://dynamo.jcabi.com/apidocs-0.16.1/index.html).
There is a package called `com.jcabi.dynamo.mock` that contains
only fake classes, suitable only for unit testing.

Even though their sole purpose is to optimize unit testing, we ship
them together with production code, in the same JAR package.

This is how a test will look like, when a fake class `MkRegion` is used:

{% highlight java %}
public class EmployeeTest {
  public void canFetchSalaryFromDynamoDb() {
    Region region = new MkRegion(
      new H2Data().with(
        "employees", new String[] {"name"},
        new String[] {"salary"}
      )
    );
    region.table("employees").put(
      new Attributes()
        .with("name", "Jeff")
        .with("salary", new AttributeValue().withN(50000))
    );
    Employee emp = new Employee("Jeff", region);
    assertThat(emp.salary(), equalTo(50000))
  }
}
{% endhighlight %}

This test looks obvious to me. First, we create a fake DynamoDB region,
which works on top of `H2Data` storage (in-memory H2 database). The storage
will be ready for a single table `employees` with a hash key `name` and
a single attribute `salary`.

Then, we put a record into the table, with a hash `Jeff` and a salary
`50000`.

Finally, we create an instance of class `Employee` and check how it
fetches the salary from DynamoDB.

I'm doing the same in almost every open source library I'm working with.
I'm creating a collection of fake classes, that simplify testing
inside the library and for its users.