CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY,
  "username" text UNIQUE NOT NULL,
  "avatar_url" text,
  "bio" text,
  "created_at" timestamp
);

CREATE TABLE "communities" (
  "id" uuid PRIMARY KEY,
  "name" text UNIQUE NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "created_by" uuid,
  "created_at" timestamp
);

CREATE TABLE "posts" (
  "id" uuid PRIMARY KEY,
  "community_id" uuid,
  "author_id" uuid,
  "title" text NOT NULL,
  "content" text,
  "url" text,
  "image_url" text,
  "post_type" text,
  "created_at" timestamp
);

CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY,
  "post_id" uuid,
  "author_id" uuid,
  "parent_id" uuid,
  "content" text NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "post_votes" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "post_id" uuid,
  "value" int,
  "created_at" timestamp
);

CREATE TABLE "comment_votes" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "comment_id" uuid,
  "value" int,
  "created_at" timestamp
);

CREATE TABLE "community_memberships" (
  "id" uuid PRIMARY KEY,
  "community_id" uuid,
  "user_id" uuid,
  "role" text,
  "joined_at" timestamp
);

CREATE UNIQUE INDEX ON "post_votes" ("user_id", "post_id");

CREATE UNIQUE INDEX ON "comment_votes" ("user_id", "comment_id");

CREATE UNIQUE INDEX ON "community_memberships" ("community_id", "user_id");

ALTER TABLE "communities" ADD FOREIGN KEY ("created_by") REFERENCES "profiles" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("community_id") REFERENCES "communities" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("author_id") REFERENCES "profiles" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("author_id") REFERENCES "profiles" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("parent_id") REFERENCES "comments" ("id");

ALTER TABLE "post_votes" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");

ALTER TABLE "post_votes" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "comment_votes" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");

ALTER TABLE "comment_votes" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("id");

ALTER TABLE "community_memberships" ADD FOREIGN KEY ("community_id") REFERENCES "communities" ("id");

ALTER TABLE "community_memberships" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");
