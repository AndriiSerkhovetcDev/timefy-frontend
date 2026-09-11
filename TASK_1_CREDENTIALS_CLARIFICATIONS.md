# Уточнення для завершення задачі 1: credentials та зміна email

## Контекст

На frontend уже реалізовано:

- відображення `Створити login і пароль`, коли `user.authData.isWeb === false`;
- форму та валідацію `login`, `password`, `confirmPassword`;
- `POST /api/v1/auth/create-password` з cookies та access token;
- оновлення користувача після успішного створення credentials;
- обробку `LOGIN_ALREADY_EXISTS`, `PASSWORD_ALREADY_CONFIGURED`,
  `AUTH_RATE_LIMITED`, `USER_INACTIVE` та `USER_NOT_FOUND`;
- recovery через один refresh після невизначеної network/5xx помилки;
- зміну email через `POST /api/v1/users/update-profile`;
- logout між вкладками та перехід на login після підтвердженої зміни email.

## Питання, які потрібно уточнити

### 1. Як однозначно визначити, що email фактично змінився?

Один endpoint `update-profile` використовується і для звичайного оновлення профілю, і для зміни
email. Після фактичної зміни email frontend повинен одразу очистити авторизацію, але після
відправлення того самого email — залишити сесію активною.

Порівняння введеного email із локальним значенням ненадійне через backend normalization та
можливий неактуальний frontend state.

Потрібна явна ознака у response, наприклад:

```json
{
  "data": {
    "user": {},
    "emailChanged": true
  }
}
```

Або окремий стабільний `code`, який означає, що сесії вже відкликано. Який точний контракт
використовувати?

### 2. Який повний success response `create-password`?

Потрібно підтвердити, що `POST /api/v1/auth/create-password` завжди повертає повний актуальний
`data.user`, включно з:

- `role`;
- `emailVerified`;
- `avatar`;
- `authData.isWeb`;
- `authData.isGoogle`.

Чи може `data.user` бути частковим DTO?

### 3. Який recovery-контракт після `PASSWORD_ALREADY_CONFIGURED` і network/5xx?

ТЗ вимагає один раз викликати `/api/v1/auth/refresh` та перевірити актуальне
`user.authData.isWeb`.

Потрібно підтвердити:

- що поточний тип сесії гарантовано підтримує USER refresh;
- що refresh завжди повертає повний `data.user.authData`;
- що робити, якщо recovery refresh завершився network/5xx;
- що робити, якщо recovery refresh повернув `AUTH_REFRESH_INVALID`.

### 4. Чи `authData` гарантовано присутній у всіх Auth та Users responses?

Frontend використовує `authData.isWeb` як єдине джерело істини для доступності створення пароля.
Потрібно підтвердити, що `authData` присутній після login, register, OAuth exchange, refresh,
update-profile та create-password.

### 5. Поведінка після `EMAIL_CHANGE_REQUIRES_AUTH_METHOD`

Після створення login/password frontend повертає користувача до форми з раніше введеним email,
але не повторює зміну автоматично.

Потрібно підтвердити:

- чи зберігаємо pending email лише до закриття/перезавантаження сторінки;
- чи треба повторно показати користувачу confirmation перед новим submit;
- чи потрібен окремий текст від backend для цього сценарію.

### 6. Що означають `USER_INACTIVE` і `USER_NOT_FOUND` для сесії?

ТЗ вимагає очистити локальний Auth state і відкрити login. Потрібно підтвердити, чи frontend має
додатково викликати `/auth/logout`, чи локального logout достатньо, оскільки поточна backend-сесія
може бути вже невалідною.

## Мінімальні відповіді для закриття задачі

1. Точна ознака фактичної зміни email у success response.
2. Повні response body для `create-password` та `update-profile` у всіх описаних success flows.
3. Гарантія наявності повного `authData` у перелічених responses.
4. Очікувана поведінка recovery refresh при network/5xx та невалідній сесії.
5. Чи потрібен backend logout після `USER_INACTIVE`/`USER_NOT_FOUND`.
