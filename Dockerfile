FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY . /usr/share/nginx/html/
# Also copy everything into /slug/ subfolder so proxy-with-no-strip works
RUN mkdir -p /usr/share/nginx/html/stim-learn && cp -r /usr/share/nginx/html/i18n /usr/share/nginx/html/stim-learn/
RUN cp /usr/share/nginx/html/index.html /usr/share/nginx/html/stim-learn/index.html
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
