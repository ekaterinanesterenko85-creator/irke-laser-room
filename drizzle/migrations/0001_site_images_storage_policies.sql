create policy "Admins upload site images"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update site images"
on storage.objects for update to authenticated
using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete site images"
on storage.objects for delete to authenticated
using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins read site images"
on storage.objects for select to authenticated
using (bucket_id = 'site-images' and public.has_role(auth.uid(), 'admin'));