--insert into fakulte(id,ad)values(3,'iibf')
--select* from bolum
--insert into bolum (bolumıd,bolumad,bolumf) values (8,'besyo',1)
--bölümü mühendialik fakültesi olan bölümleri listele
--select * from bolum where bolumf=(select id from fakulte where ad='iibf')

--select bolumf, count(*) from bolum group by bolumf order by bolumf
--select ad,count(*) from bolum inner join fakulte on bolum.bolumf= fakulte.id group by ad order by ad 
---insert into bolum (bolumıd,bolumad,bolumf) values (8,'metalurji',1)

select max(bolum) from fakulte