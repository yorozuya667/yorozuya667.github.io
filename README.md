# Wedding invite starter for GitHub Pages

Внутри:
- `index.html` — сайт для GitHub Pages с анимацией: интро-видео → белая вспышка → плавный выход сайта
- `.nojekyll` — чтобы GitHub Pages не лез в Jekyll
- `apps-script/Code.gs` — legacy-вариант (если когда-нибудь захотите вернуть Google Sheets)

## Текущий сценарий: подтверждение через Tally

Без Apps Script и без Google-плашек.

Если кнопка не ведёт в форму: проверь, что в `index.html` заменён `PASTE_YOUR_TALLY_FORM_ID` на реальную ссылку и что в проекте нет старой версии страницы с токенами.

Гость:
- вводит **имя**
- выбирает **количество гостей**
- нажимает кнопку **«Приду»**
- сайт перенаправляет в вашу форму Tally

## 1. Что заменить в `index.html`

Найди в форме:

`https://tally.so/r/PASTE_YOUR_TALLY_FORM_ID`

и вставь свою ссылку Tally (пример: `https://tally.so/r/abcd12`).

## 2. Поля формы

На странице используются:
- `guestName` — имя
- `guestCount` — количество гостей

Создай аналогичные поля в Tally.

На странице также есть переключатель языков: **RU / KZ / EN**.

## 3. Интро-видео

Положи видео в:

`assets/intro.mp4`

или поменяй путь в строке:

`<source src="assets/intro.mp4" type="video/mp4" />`

## 4. Как выложить на GitHub Pages

1. Загрузи `index.html` и `.nojekyll`
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
