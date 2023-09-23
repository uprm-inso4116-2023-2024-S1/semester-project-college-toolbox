
create table "user"(
    userId serial primary key ,
    FirstName varchar,
    Initial varchar,
    FirstLastName varchar,
    SecondLastName varchar,
    Email varchar not null,
    EncryptedPassword varchar not null,
    Salt varchar not null,
    ProfileImageUrl varchar
);

create table "document"
(
    docId      serial primary key,
    filename varchar not null,
    data varchar not null,
    filetype varchar not null,
    created timestamp,
    lastModified timestamp,
    userId   INTEGER constraint document_userId references "user"

);


create table "resume"(
    resumeId serial primary key,
    docId integer constraint resume_docId references "document"
);

create table "application"(
    appId serial primary key,
    company varchar,
    "position" varchar,
    status varchar not null,
    created timestamp not null,
    lastModified timestamp not null,
    docId  integer constraint application_docId references "document"
);


