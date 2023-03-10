[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)

# Проектная работа №14: проект Mesto фронтенд + бэкенд

Ссылка на репозиторий проекта: https://github.com/rem-ran/express-mesto-gha

1. в package.json добавлены команды start, dev и команда lint с содержанием npx eslint;
2. В проекте есть файл .eslintrc, .editorconfig, .gitignore;
3. Код разбит на роуты, модели и контроллеры, расположенные в соответствующих
   папках;
4. Используются такие npm пакеты как: express, nodemon, body-parser, eslint, mongoose и др.;
5. Все поля схем пользователя и карточки валидируются;
6. В файлах схем создаются и экспортируются модели с именами user и card;
7. Ответ сервера на запрос отправляется только один раз;
8. Если в любом из запросов что-то идёт не так, сервер возвращает ответ с ошибкой и соответствующим ей
   статусом. Ответ с ошибкой содержит только поле message;
9. Статусы ошибок вынесены в константы;
10. Во всех контроллерах предусмотрена гарантированная отправка сообщения об ошибке;
11. При разных запросах сервер не падает и в консоли нет ошибок;
12. Все роуты, кроме /signin и /signup, защищены авторизацией;
13. Пользователь не может удалить карточку, которую он не создавал;
14. Тела запросов валидируются с помощью celebrate;
15. Поля avatar и link проверяются регулярным выражением;
16. Для ошибок созданы классы конструкторы ошибок, наследуемые от Error;
17. Реализована централизованная обработка ошибок в единой middleware;
18. В ответ на успешную авторизацию контроллер login возвращает клиенту созданный токен в куки.

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки  
`/models` — папка с файлами описания схем пользователя и карточки

Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер  
`npm run dev` — запускает сервер с hot-reload
`npm run lint` — выполняется проверка проекта, в результате работы которой должны
отсутствовать ошибки линтинга
