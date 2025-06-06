Create table If Not Exists Person (id int, email varchar(255));
Truncate table Person;
insert into Person (id, email) values ('1', 'a@b.com');
insert into Person (id, email) values ('2', 'c@d.com');
insert into Person (id, email) values ('3', 'a@b.com');

select p.email as Email
from Person p
where email in (
  select email
  from Person p2 where p.id <> p2.id
)
GROUP BY p.email;