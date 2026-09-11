# Уточнення для завершення задачі 2: session refresh

## Контекст

На frontend уже реалізовано USER session flow:

- `credentials: "include"` для login, register, OAuth exchange, refresh і logout;
- refresh після `401` з `errorCode: "UNAUTHORIZED"` для захищеного запиту;
- один спільний refresh для паралельних запитів у межах вкладки;
- одноразове повторення початкового запиту з новим access token;
- обробку `AUTH_REFRESH_INVALID` і `AUTH_REFRESH_CONCURRENT`;
- збереження локальної авторизації при network/5xx refresh-помилці;
- logout поточної USER-сесії та синхронізацію logout між вкладками;
- заміну token/user після успішної зміни пароля.

## Головний блокер: сесії не-USER ролей

ТЗ прямо зазначає:

> Реалізувати роботу звичайної USER-сесії. ADMIN-сесії в це завдання не входять.

Тому frontend зараз викликає `/api/v1/auth/refresh` лише для `role === "USER"`.

Фактичний сценарій показав, що захищений запит користувача іншої ролі повертає:

```json
{
  "status": 401,
  "errorCode": "UNAUTHORIZED",
  "message": "INVALID_TOKEN"
}
```

Refresh не запускається через обмеження ролі, і після завершення access token користувач повинен
увійти повторно.

Потрібно визначити для кожної ролі `ADMIN` і `SUPPORT`:

1. Чи створює backend refresh-cookie та browser-binding cookie після login/OAuth?
2. Чи дозволено цій ролі викликати `POST /api/v1/auth/refresh`?
3. Якщо ні, який окремий refresh endpoint і cookie names потрібно використовувати?
4. Який logout endpoint потрібно викликати?
5. Що frontend має робити після `401 UNAUTHORIZED`: refresh чи негайний logout/login?
6. Чи існує та підтримується роль `OWNER`?

Якщо `/api/v1/auth/refresh` підтримує всі ролі, потрібно явно дозволити frontend прибрати перевірку
`role === "USER"` і застосовувати однаковий flow для `USER`, `ADMIN` та `SUPPORT`.

## Інші питання

### 1. Bootstrap refresh

Чи потрібно викликати refresh при старті застосунку, якщо HttpOnly cookies можуть існувати, але
access token у frontend відсутній? Якщо так:

- на всіх сторінках чи лише перед protected routes;
- який UI показувати під час перевірки;
- як поводитися при network/5xx.

### 2. Зберігання access token

ТЗ забороняє зберігати refresh token і binding secret, але не визначає політику access token.
Чи залишаємо access token у `localStorage`, чи зберігаємо тільки в пам'яті? Для memory-only flow
bootstrap refresh після reload стає обов'язковим.

### 3. Координація між вкладками

Single-flight зараз працює лише в межах однієї вкладки. Чи достатньо обробки міжвкладкового
конфлікту через `409 AUTH_REFRESH_CONCURRENT`, чи вкладки мають координувати refresh та передавати
новий access token через `BroadcastChannel`?

### 4. Повтор після `AUTH_REFRESH_CONCURRENT`

Frontend очікує `Retry-After` і повторює refresh один раз. Чи правильний цей ліміт? Backend
гарантує `Retry-After` у секундах, HTTP-date або допускає відсутній заголовок?

### 5. Навігація після `AUTH_REFRESH_INVALID`

На protected route очищення Auth state активує route guard і відкриває `/login`. Чи потрібно також
мати глобальну примусову навігацію, якщо refresh був викликаний поза protected route? Яке
повідомлення показувати користувачу?

### 6. Logout при network/5xx

Поточний ручний logout є best effort: frontend очищає локальну авторизацію навіть якщо backend
logout завершився network/5xx. Чи правильна така поведінка, враховуючи що backend-сесія може
залишитися активною?

### 7. Runtime validation refresh response

Чи достатньо довіряти контракту `{ data: { token, user } }`, чи frontend повинен runtime-перевіряти
response? Що робити при HTTP 200 без повного token/user?

## Мінімальні відповіді для закриття задачі

1. Матриця refresh/logout поведінки для `USER`, `ADMIN`, `SUPPORT` і, за потреби, `OWNER`.
2. Політика bootstrap refresh і зберігання access token.
3. Чи потрібна міжвкладкова координація refresh.
4. Ліміт і формат retry для `AUTH_REFRESH_CONCURRENT`.
5. UX після `AUTH_REFRESH_INVALID` та network/5xx.
6. Чи потрібна runtime validation Auth responses.
