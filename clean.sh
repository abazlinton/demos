# try and delete files / suppress errors
# can't remove all due to .vercel meh

rm ./public/*.js 2> /dev/null || true
rm ./public/*.html 2> /dev/null || true
rm ./public/*.map 2> /dev/null || true
rm ./public/*.png 2> /dev/null || true


