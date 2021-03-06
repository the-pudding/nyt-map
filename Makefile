PHONY: github aws-assets aws-htmljs aws-cache copy-data

github:
	rm -rf docs
	cp -r dist/ docs
	git add -A
	git commit -m "update dev version"
	git push

archive:
	zip -r archive.zip dev

aws-assets:
	aws s3 sync dist s3://pudding.cool/2018/12/countries --delete --cache-control 'max-age=31536000' --exclude 'index.html' --exclude 'bundle.js'

aws-htmljs:
	aws s3 cp dist/index.html s3://pudding.cool/2018/12/countries/index.html
	aws s3 cp dist/bundle.js s3://pudding.cool/2018/12/countries/bundle.js

aws-cache:
	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/2018/12/countries*'	

pudding: aws-assets aws-htmljs aws-cache archive

copy-data:
	cp ~/Pudding/helpers/nyt-map-data/output/countries.csv src/assets/data
	cp ~/Pudding/helpers/nyt-map-data/output/result--month.csv src/assets/data
	cp src/assets/data/headlines.csv src/assets/data/headlines-prev.csv
	cp ~/Pudding/helpers/nyt-map-data/output/headlines.csv src/assets/data
	