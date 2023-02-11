import { I18n } from 'i18n-js';
import bur from '../i18n/bur.json';
import ru from '../i18n/ru.json';

// @todo replace it with i18next and react-i18next

const i18n = new I18n({ bur, ru });
i18n.locale = 'ru';

export default i18n;
