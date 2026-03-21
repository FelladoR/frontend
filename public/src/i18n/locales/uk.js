window.locale_uk = {
    hero: {
        description: "Надійний захист вашої спільноти від спаму та рейду",
        link_to_add: "Додати бота",
        docs: "Документація"
    },

    stats: {
        title: "Наші ключові функції",
        verification_title: "Верифікація",
        verification_desc: "Перевірка нових користувачів за допомогою капчі",

        invitesblock_title: "Блокування запрошень",
        invitesblock_desc: "Контроль над запрошеннями, які можуть бути опубліковані на сервері",

        blacklist_title: "Чорний список порушників",
        blacklist_desc: "Захист від небажаних, набезпечних користувачів та ботів",

        active_guilds: "активних серверів",
        efficiency: "ефективності",
        online_support: "онлайн підтримка",
        members: "учасників"
    },

    appeal: {
        main_title: "Форма апеляції",
        main_description: "Подайте заявку на оскарження чорного списку або попередження в базі даних бота AntiLink. Ми розглянемо ваш запит якомога швидше.",
        form: {
            title_discord_id: "Ваш Discord ID",
            punish_date: "Приблизна дата отримання покарання",
            reason: "Причина покарання",
            reason_desc: "Опишіть детально причину, через яку ви отримали покарання...",
            moderator: "Модератор, який видав покарання?",
            moderator_desc: "ID або нікнейм модератора",
            mistake: "Чи зрозуміли Ви свою помилку?",
        },
        button_send: "Надіслати заявку"
    },

    dashboard: {
        main_title: "Ласкаво просимо, ",
        main_desc: "Ваші сервери",
        guild_loading: {
            checking: "Перевірка...",
            setup: "Налаштувани",
            add: "Додати "
        },
        no_servers: "У вас немає серверів, де ви є власником"
    },

    guild: {
        back: "← Назад",
        head_buttons: {
            main_settings: "Основні налаштування",
            logging: "Логування",
            verification: "Верифікація",
            backups: "Резервні копіювання"
        },

        main_settings: {
            title: "Основні налаштування",
            language: "Мова бота:",
            people_ban: "Блокування запрошень та людей в ЧС:",
            whitelist: "Білий список ролей:",
            search_placeholder: "Шукати роль...",
            no_roles: "Немає доступних ролей або збігів пошуку",
            saving: "Збереження...",
            save_settings: "Зберегти налаштування"
        },
        logging: {
            title: "Налаштування логування",
            current_webhook: "Поточний вебхук для логів:",
            webhook_data: {
                name: "Назва:",
                channel: "Канал:",
                url: "URL вебхука:"
            },
            not_setup: "Вебхук не налаштовано",
            choose_webhook: "Оберіть новий вебхук:"
        },

        verification: {
            title: "Налаштування верифікації",
            verifed_members: "Роль верифікованих користувачів:",
            new_members: "Роль нових користувачів:",
            choose_role: ">-- Оберіть роль --<",
            choose_channel: ">-- Оберіть канал --<",
            channel: "Канал верифікації",
            enable_captcha: "Увімкнути капчу"
        },

        backups: {
            title: "Резервні копіювання",
            no_perms: "Для роботи з резервними копіями боту потрібні права <strong>Адміністратора</strong>",
            backups_list: "Список резервних копій",
            loading: "Завантаження...",
            no_backups: "Резервні копії відсутні",
            date: "Дата створення",
            actions: "Дії",
            recovery: "Відновлення...",
            wait: 'Чекайте',
            restore: 'Відновити',
            cooldown: "Повторне відновлення буде доступне через {{ cooldownTime }} секунд",
            delete: "Видалити",
            creating: "Створення...",
            create: "Створити резервну копію",
            all_backups: "Всього копій:"
        }
    },

    backups: {
        title: "Antilink - Резервні копії",
        page_title: "Резервні копії",
        page_description: "Керуйте резервними копіями ваших серверів. Створюйте, відновлюйте та моніторьте стан бекапів.",
        loading: "Завантаження резервних копій...",
        status_completed: "Успішно",
        created: "Створено",
        type: "Тип",

        // Статистика
        stats_categories: "Категорій",
        stats_channels: "Каналів",
        stats_roles: "Ролей",
        stats_emojis: "Емодзі",

        // Дії
        action_restore: "Відновити",
        action_details: "Деталі",
        action_delete: "Видалити",

        // Дебаг інформація
        debug_title: "Дебаг інформація для бекапу {{id}}:",
        debug_details_loaded: "Деталі завантажені:",
        debug_roles_count: "Кількість ролей:",
        debug_first_roles: "Перші 3 ролі:",
        debug_color: "Колір",

        // Секції
        section_roles: "Ролі",
        section_channels: "Канали",
        section_emojis: "Емодзі",

        // Ролі
        role_position: "Позиція",
        role_permissions: "Права",
        role_hoist: "Відокремлена",
        role_mentionable: "Можна згадувати",
        role_admin: "Адміністратор",

        // Емодзі
        emoji_animated: "Анімоване",
        emoji_static: "Статичне",
        emoji_managed: "Управляється",

        // Пустий стан
        empty_state_title: "Резервних копій ще немає",
        empty_state_description: "Створіть свою першу резервну копію, щоб захистити дані ваших серверів",

        // Списки
        no_roles: "Ролі відсутні",
        no_channels: "Канали відсутні",
        no_emojis: "Емодзі відсутні",

        // Модальне вікно
        channels_count: "каналів",
        categories_count: "категорій",
        channel_category: "Категорія"
    },

    docs: {
        title: "AntiLink - Документація",
        main_title: "AntiLink — Документація",
        main_description: "Потужний бот для захисту вашого Discord сервера від небажаних гостей та спаму.",
        note_automatic_protection: "AntiLink автоматично захищає ваш сервер, використовуючи розширену систему модерації та базу даних користувачів.",

        features_title: "Основні функції",
        feature_unwanted_users: "Захист від небажаних користувачів",
        feature_unwanted_users_desc: "автоматичне блокування підозрілих аккаунтів",
        feature_warning_system: "Система попереджень",
        feature_warning_system_desc: "ведення бази даних з причинами покарань",
        feature_blacklist: "Чорний список",
        feature_blacklist_desc: "користувачі з 3+ попередженнями автоматично блокуються",
        feature_cross_server: "Крос-серверна база",
        feature_cross_server_desc: "блокування на всіх серверах з активованим захистом",
        feature_crash_bots: "Захист від краш-ботів",
        feature_crash_bots_desc: "автоматичне виявлення та блокування спроб зламу",

        work_concept_title: "Концепція роботи",
        concept_step1: "Бот слідкує за всіма повідомленнями, де має доступ",
        concept_step2: "При виявленні запрошення, і якщо в учасника немає ролі з білого списку - бот видаляє запрошення, та видає 1 попередження",
        concept_step3_highlight: "Третє попередження:",
        concept_step3_text: "- додавання до чорного списку та блокування",
        concept_step4: "За умови, якщо в гільдію зайшов користувач, написав повідомлення, і після перевірки бот виявив 3 попередження - його блокує.",

        warning_blacklist: "Користувачі з чорного списку автоматично блокуватимуться на всіх серверах, де доданий AntiLink з активованими налаштуваннями захисту.",
        warning_default_settings: "За замовчуванням всі налаштування бота вимкнені. Вам потрібно налаштувати бота, щоб він працював на вашій гільдії.",

        whitelist_title: "Білий список ролей",
        whitelist_note: "Ролі, додані до білого списку, обходять усі перевірки AntiLink. Користувачі з цими ролями не отримують попереджень.",
        whitelist_add: "Додати роль до білого списку",
        whitelist_remove: "Видалити роль з білого списку",
        role: "роль",
        whitelist_warning: "Будьте обережні при додаванні ролей до білого списку. Користувачі з цими ролями зможуть уникати всіх обмежень бота.",
        whitelist_permissions: "Налаштування білого списку доступні лише адміністраторам сервера з відповідними правами.",

        settings_management_title: "Керування налаштуваннями",
        command_settings: "перегляд та зміна налаштувань бота",
        command_setup: "змінити налаштування бота на гільдії",
        command_owner_only: "Доступно лише власнику сервера",

        web_panel_text: "Ви також можете змінювати налаштування через ",
        web_panel_link: "веб-панель",
        web_panel_text_after: ", що надає більш зручний інтерфейс.",

        note_attention: "Увага",
        note_owner_only: "Лише власник гільдії може змінювати налаштування бота. Це запобігає несанкціонованому втручанню у систему безпеки.",

        user_database_title: "База даних користувачів",
        user_database_desc: "AntiLink зберігає детальну інформацію про кожне порушення:",
        db_field_date: "Дата та час порушення",
        db_field_type: "Тип порушення",
        db_field_user_id: "Ідентифікатор користувача",
        db_field_moderator: "Модератор, який видав попередження",
        db_field_notes: "Додаткові нотатки"
    },

    header: {
        support: "Підтримка",
        appeal: "Апеляція",
        login_via_discord: "Увійти через Discord",
        login: "Увійти",
        my_guilds: "Мої сервери",
        my_backups: "Мої резервні копії",
        logout: "Вийти"
    },

    footer: {
        temps: "Умови використання",
        privacy: "Політика конфіденційності",
        rights: "Всі права захищені."
    },

    privacy: {
        title: "Політика конфіденційності - AntiLink",
        main_title: "Політика конфіденційності AntiLink",
        intro_text: "В даній темі описані умови використання та політика конфіденційності бота AntiLink. Використовуючи бота, ви автоматично погоджуєтесь з цими умовами.",
        priority_text: "Для нашої команди конфіденційність та безпека є найважливішими пріоритетами. Нижче наведена інформація про дані, які збираються та зберігаються в базі даних бота AntiLink.",

        data_collection_title: "Збір та обробка даних",
        data_collection_desc: "AntiLink зберігає такі технічні дані, необхідні для роботи бота:",
        data_discord_id: "Discord ID користувача",
        data_discord_id_desc: "- технічний ідентифікатор облікового запису Discord (не містить особистої інформації)",
        data_server_id: "ID серверів",
        data_server_id_desc: "- ідентифікатори Discord-серверів, де використовується бот",
        data_role_id: "ID ролей",
        data_role_id_desc: "- ідентифікатори ролей серверу, доданих до білого списку",
        data_evidence: "Докази порушень",
        data_evidence_desc: "- скріншоти (зберігаються лише у випадках порушень правил)",

        important_note: "Важливо: Бот <strong>не збирає</strong> та не зберігає такі персональні дані як:",
        not_collected_real_names: "Справжні імена користувачів",
        not_collected_emails: "Електронні адреси",
        not_collected_phones: "Номери телефонів",
        not_collected_addresses: "Фізичні адреси",
        not_collected_payment: "Платіжні дані",

        last_updated: "Останнє оновлення: 1 січня 2025 року"
    },
    tos: {
        title: "Умови користування - AntiLink",
        main_title: "Умови користування",
        intro_text: "В даній темі написані Умови користування Discord ботом AntiLink.",

        general_provisions_title: "Загальні положення",
        general_provisions_desc: "Перш за все, користуючись ботом AntiLink, ви автоматично погоджуєтесь з:",
        agreement_tos: "Умовою користування ботом AntiLink",
        agreement_privacy: "Політикою конфіденційності AntiLink",
        agreement_discord: "Умовами користування Discord",
        disagreement_warning: "Якщо ви не погоджуєтесь з Умовами користування або Політикою конфіденційності - вам заборонено використовувати нашу програму.",

        prohibited_actions_title: "Заборонені дії",
        penalties_text: "За порушення цих правил Ви можете отримати покарання у вигляді:",
        penalty_removal: "Видалення бота з вашого Discord серверу",
        penalty_blacklist: "Занесення в чорний список",
        penalty_other: "Інші санкції на розгляд розробника",
        prohibited_1_title: "Заборонено",
        prohibited_1_desc: "створювати перешкоди у роботі/збої бота",
        prohibited_2_title: "Забороняється",
        prohibited_2_desc: "використовувати бота AntiLink з метою шкоди іншим користувачам Discord",
        prohibited_3_title: "Заборонено",
        prohibited_3_desc: "навмисно використовувати недоліки бота, баги з метою отримання неправомірної вигоди",
        changes_note: "Ми можемо вносити зміни до Умов Користування з певних причин, повідомивши про це на офіційному Discord сервері технічної підтримки.",

        blacklist_title: "Чорний список",
        blacklist_desc: "Користувач може бути занесений до чорного списку з наступних причин:",
        blacklist_reason_1: "Порушення правил Discord",
        blacklist_reason_2: "Рейд серверів",
        blacklist_reason_3: "Краш-бот",
        blacklist_reason_4: "Поширення, реклама, розробка, розповсюдження і т.д забороненого ПО для нанесення шкоди користувачам або гільдіям Discord",
        blacklist_reason_5: "Реклама в особисті повідомлення/на серверах",
        blacklist_reason_6_title: "Запекла русня",
        blacklist_reason_6_desc: "(ті, які люто використовують антиукраїнські висловлювання, образи української нації, і т.д)",

        access_restrictions_title: "Обмеження доступу",
        access_restrictions_desc: "Ми маємо право обмежити вам користування нашою програмою у зв'язку з:",
        restriction_reason_1: "Порушенням правил Discord",
        restriction_reason_2: "Порушенням наших Умов користування AntiLink або політики конфіденційності",
        restriction_reason_3: "Виконанням вимог Discord",
        restriction_reason_4: "Підставами вважати, що ви наносите шкоду нашій програмі"
    },

    error: {
        title: "Помилка"
    }
}
