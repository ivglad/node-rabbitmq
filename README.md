# Node-rabbitmq
###### _Асинхронная обработка HTTP запросов с использование Node.js и RabbitMQ_

### Инструкция

#### Необходимо установить в зависимости от платформы:
`Windows`
- WSL2
- Образ Ubuntu для wsl
- Docker desktop (или установленный Docker engine в wsl)

`Linux`
- Docker engine или Docker desktop


#### Запуск:
1. Скачать проект
2. В папке с проектом ввести команду `docker compose up -d` (или `docker-compose up -d` в зависимости от версии docker'a)
3. Дождаться установки образов и старта контейнеров

Запускаемые контейнеры 
- Nginx (reverse proxy)
- Worker (nodejs service)
- Api (nodejs service)
- RabbitMQ

Первый старт контейнера с RabbitMQ может занять некоторое время (установка плагинов, около 30сек)


#### Использование:

После старта всех контейнеров Вам будут доступны:
1. RabbitMQ веб-интерфейс http://localhost:15672/ (login - `user`, password - `password`)
2. Api http://localhost:5001/api/sendMessage

Для проверки работы сервисов на эндпоинт `http://localhost:5001/api/sendMessage` требуется послать _HTTP POST_ запрос с _BODY_ в виде _JSON_ содержащий любое сообщение в формате:
```sh
{
  "text": "my new message"
}
```
После чего сервис вернет результат:
```sh
{
  "status": "ok",
  "message": {
    "text": "my new message",
    "id": "lkw6066xymycb5mj85o",
    "jobStartDateTime": "2023-08-03T09:48:16.089Z",
    "jobEndDateTime": "2023-08-03T09:48:17.999Z"
  }
}
```
Обработка запроса может занимать от нескольких миллисекунд до нескольких секунд (эмуляция выполнения задания)

Логи сервисов `worker` и `api` можно посмотреть стандартными средствами Docker (через desktop версию или командой `docker compose logs -f 'имя контейнера'`), после отправки запроса они транслируются на каждом важном этапе (публикация, изъятие из очередей)
