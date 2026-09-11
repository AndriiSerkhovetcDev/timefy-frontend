# Уточнення щодо USER token/session flow

## Контекст

На frontend уже реалізовано базову інфраструктуру USER-сесії:

- `credentials: "include"` для login, register і OAuth exchange;
- автоматичний `POST /api/v1/auth/refresh` після `401` з `errorCode: "UNAUTHORIZED"`;
- один спільний refresh-запит для паралельних запитів у межах однієї вкладки;
- одноразове повторення початкового запиту з новим access token;
- обробка `AUTH_REFRESH_INVALID`;
- один повтор refresh після `AUTH_REFRESH_CONCURRENT` та очікування `Retry-After`;
- збереження локальної авторизації при network error або `5xx` під час refresh;
- `POST /api/v1/auth/logout` для поточної USER-сесії;
- синхронізація logout між вкладками через `BroadcastChannel` і `storage` event.

Нижче перелічено те, що ще не реалізовано або було реалізовано на основі припущень і потребує підтвердження.

## 1. Bootstrap refresh при запуску застосунку

Не реалізовано автоматичний refresh під час першого завантаження frontend.

Проблемний сценарій:

1. У браузері є валідні HttpOnly refresh і binding cookies.
2. У frontend немає access token, наприклад після очищення `localStorage`.
3. Користувач відкриває захищений маршрут.
4. Поточний `ProtectedRoute` одразу перенаправляє його на `/login`, тому жодний protected request не встигає запустити refresh.

Потрібно уточнити:

- чи повинен frontend викликати `POST /api/v1/auth/refresh` при старті застосунку, якщо access token відсутній;
- чи потрібно робити bootstrap refresh на всіх сторінках або лише перед відкриттям protected routes;
- який UI показувати під час перевірки сесії;
- як відрізнити відсутню сесію від тимчасової network/5xx помилки.

## 2. Зберігання access token

Поточний frontend продовжує зберігати access token у persisted Zustand state через `localStorage` під ключем `auth-storage`.

ТЗ явно забороняє зберігати refresh token і browser-binding secret, але не визначає політику для access token.

Потрібно підтвердити:

- access token залишається в `localStorage`;
- чи його потрібно зберігати лише в пам’яті;
- якщо token зберігається лише в пам’яті, чи bootstrap refresh є обов’язковим після кожного reload сторінки.

## 3. Single-flight між різними вкладками

Зараз одночасно виконується лише один refresh у межах одного JavaScript context, тобто однієї вкладки.

Різні вкладки можуть одночасно запустити власні refresh-запити. Конфлікт обробляється через `409 AUTH_REFRESH_CONCURRENT`, але вкладки не діляться отриманим новим access token.

Потрібно уточнити:

- чи достатньо single-flight у межах однієї вкладки;
- чи потрібно координувати refresh між вкладками;
- чи потрібно передавати новий access token між вкладками;
- чи безпечно передавати access token через `BroadcastChannel`;
- чи рекомендовано замість цього дозволити кожній вкладці повторити refresh після `Retry-After`.

## 4. Ліміт повторень `AUTH_REFRESH_CONCURRENT`

Зараз frontend після першого `409 AUTH_REFRESH_CONCURRENT`:

1. читає `Retry-After`;
2. очікує вказаний час;
3. повторює refresh один раз;
4. після другого невдалого refresh більше автоматично не повторює запит.

Потрібно підтвердити, що один повтор є правильним лімітом.

## 5. Формат `Retry-After`

Frontend підтримує обидва стандартні формати:

- кількість секунд;
- HTTP-date.

Якщо заголовок відсутній або некоректний, використовується fallback `1` секунда.

Потрібно підтвердити:

- який формат фактично повертає backend;
- чи правильний fallback в одну секунду;
- чи backend гарантує наявність `Retry-After` для `AUTH_REFRESH_CONCURRENT` і `AUTH_RATE_LIMITED`.

## 6. Поведінка при network error або `5xx` під час refresh

Зараз frontend:

- не очищає access token і user;
- не повторює refresh автоматично;
- не повторює початковий protected request;
- повертає помилку коду, який викликав API request.

Потрібно уточнити:

- яке повідомлення потрібно показувати користувачу;
- чи потрібна глобальна сторінка або banner про тимчасову недоступність;
- чи дозволений ручний повтор операції;
- чи потрібно мати окремий timeout для refresh request.

## 7. Перехід на login після `AUTH_REFRESH_INVALID`

Зараз при `401 AUTH_REFRESH_INVALID` frontend очищає Zustand auth state і повідомляє інші вкладки про logout.

На protected route це автоматично активує route guard і перенаправляє користувача на `/login`.

Не реалізовано окрему глобальну навігацію на login, якщо refresh був запущений зі сторінки, яка не знаходиться під `ProtectedRoute`.

Потрібно уточнити:

- чи достатньо поведінки route guard;
- чи потрібно завжди примусово відкривати `/login`;
- чи потрібно показувати причину, наприклад «Сесію завершено. Увійдіть повторно»;
- як передавати цю причину: router state, query parameter чи глобальний auth event.

## 8. USER та інші ролі

Автоматичний `/api/v1/auth/refresh` і backend logout зараз запускаються лише коли `user.role === "USER"`.

Для `ADMIN`, `SUPPORT` і `OWNER` frontend не викликає USER session endpoints. При ручному logout для цих ролей очищається лише локальний auth state.

Потрібно підтвердити:

- чи `SUPPORT` використовує USER або ADMIN session flow;
- чи роль `OWNER` досі підтримується backend;
- що frontend має робити після `401 UNAUTHORIZED` для не-USER ролей;
- які refresh/logout endpoints будуть використовувати ADMIN та SUPPORT.

## 9. Logout при network error або `5xx`

Зараз ручний logout працює за принципом best effort:

1. frontend намагається викликати `POST /api/v1/auth/logout`;
2. якщо запит успішний, backend відкликає сесію та очищає cookies;
3. якщо запит завершився network/5xx помилкою, frontend все одно очищає локальний token і user;
4. інші вкладки також отримують logout event.

Це означає, що після network failure backend-сесія може залишитися активною, хоча поточний frontend уже вийшов із неї.

Потрібно підтвердити, що така поведінка правильна, або визначити інший UX.

## 10. Повна перевірка refresh response

Зараз frontend очікує:

```json
{
  "data": {
    "token": "NEW_ACCESS_TOKEN",
    "user": {}
  }
}
```

Відповідь типізована, але runtime schema validation не виконується. Якщо backend поверне HTTP 200 без token або user, frontend може записати некоректну сесію.

Потрібно уточнити:

- чи вважається контракт backend достатньою гарантією;
- чи потрібна runtime validation auth responses;
- що робити при HTTP 200 з неповною або некоректною структурою.

## 11. Авторизована зміна пароля

Уже реалізовано:

- `POST /api/v1/auth/change-password`;
- форму `currentPassword` / `newPassword` / `confirmPassword`;
- заміну access token і user після успішної зміни пароля;
- обробку `INVALID_CREDENTIALS`, `ACCESS_DENIED` та `AUTH_RATE_LIMITED`;
- UX для rate-limit countdown.

Старий flow «Змінити пароль через email» тимчасово залишено як окрему recovery-опцію для користувача з `authData.isWeb === true`.

Потрібно підтвердити, чи обидві дії мають залишатися доступними одночасно, чи password-reset-by-email потрібно прибрати зі сторінки безпеки.

## 12. Питання щодо `credentials: include`

Frontend зараз завжди використовує `credentials: "include"` для login, register, OAuth exchange, refresh і logout у всіх середовищах.

Потрібно підтвердити, що environment-specific вимкнення `credentials` не потрібне. Постійна конфігурація дає однакову поведінку local/test/production і потрібна для cross-origin cookies.

## Питання, без яких можна продовжити наступний етап

Реалізацію create-password та email-change можна почати після підтвердження окремих контрактів із першого ТЗ. Найважливіші з них:

1. Яка явна ознака у відповіді `update-profile` повідомляє, що email фактично змінився і сесію відкликано?
2. Чи `data.user` у відповіді `create-password` завжди є повним user DTO?
3. Який точний response body повертає `/auth/refresh` після recovery для `create-password`?
4. Чи `authData` гарантовано присутній у всіх Auth і Users API responses?
