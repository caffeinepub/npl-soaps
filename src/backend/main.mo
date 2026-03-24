import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";

actor {
  type Product = {
    id : Text;
    name : Text;
    benefits : [Text];
    price : Nat;
    category : Text;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module ContactSubmission {
    public func compare(a : ContactSubmission, b : ContactSubmission) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type ContactSubmissionPublic = {
    name : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type ContactSubmissionAdmin = {
    email : Text;
    name : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let products = Map.fromIter<Text, Product>([].values());
  let contactSubmissions = Map.fromIter<Nat, ContactSubmission>([].values());
  var nextContactId = 0;

  public query ({ caller }) func getAllProducts() : async ?[Product] {
    let size = products.size();
    if (size == 0) { return null };
    ?products.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().filter(
      func(product) { product.category == category }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Bool {
    let submission : ContactSubmission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(nextContactId, submission);
    nextContactId += 1;
    true;
  };

  system func preupgrade() {
    contactSubmissions.add(99_900, {
      email = "test@example.com";
      name = "Test User";
      message = "This is a test submission for the preupgrade function.";
      timestamp = Time.now();
    });
    products.add(
      "test-soap-bar",
      {
        id = "test-soap-bar";
        name = "Test Soap Bar";
        benefits = ["testing", "validation"];
        price = 9900;
        category = "test";
      },
    );
  };

  public query ({ caller }) func getContactSubmissionsAdmin() : async [ContactSubmissionAdmin] {
    contactSubmissions.values().toArray().sort().map(
      func(s) {
        {
          s with
          timestamp = s.timestamp;
        };
      }
    );
  };
};
