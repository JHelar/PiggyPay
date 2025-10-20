create table if not exists "users" (
    id integer not null primary key generated always as identity,
    first_name nvarchar(75) not null,
    last_name nvarchar(75) not null,
    phone_number nvarchar(13) not null unique,
    email nvarchar(320) not null unique,

    created_at timestamp default current_timestamp,
    updated_at datetime default current_timestamp
);

create table if not exists "groups" (
    id integer not null primary key generated always as identity,

    display_name nvarchar(75) not null,
    state nvarchar(10) not null,
    color_theme tinyint not null,
    admin_user_id integer not null references "users"(id),

    created_at timestamp default current_timestamp,
    updated_at datetime default current_timestamp
);

create table if not exists "group_expenses" (
    id integer primary key generated always as identity,
    group_id integer not null references "groups"(id) on delete cascade,
    user_id integer not null references "users"(id) on delete cascade,

    name nvarchar(75) not null,
    cost float(24) not null,

    created_at timestamp default current_timestamp,
    updated_at datetime default current_timestamp
);

create table if not exists "group_members" (
    group_id integer not null references "groups"(id) on delete cascade,
    user_id integer not null references "users"(id) on delete cascade,
    state nvarchar(10) not null,

    created_at timestamp default current_timestamp,
    updated_at datetime default current_timestamp,

    primary key (group_id, user_id)
);

create table if not exists "group_member_transactions" (
    id integer primary key generated always as identity,

    group_id integer not null references "groups"(id),
    from_user_id integer not null references "users"(id),
    to_user_id integer not null references "users"(id),

    state nvarchar(10) not null,
    cost float(24) not null,

    created_at timestamp default current_timestamp,
    payed_at datetime default current_timestamp
);