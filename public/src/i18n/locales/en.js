window.locale_en = {
    hero: {
        description: "Powerful security for your guild from spam and raiders",
        link_to_add: "Add the bot",
        docs: "Documentation"
    },

    stats: {
        title: "Our basic functions",
        verification_title: "Verification",
        verification_desc: "Check new members with captcha system",

        invitesblock_title: "Invites blocking",
        invitesblock_desc: "Control and block invites, which should be published on guild.",

        blacklist_title: "Blacklist of violators",
        blacklist_desc: "Protection against unwanted, unsafe users and bots",

        active_guilds: "active guilds",
        efficiency: "efficiency",
        online_support: "online support",
        members: "members"
    },

    appeal: {
        main_title: "Appeal form",
        main_description: "Submit a request to appeal a blacklisting or warning in the AntiLink bot database. We will review your request as soon as possible.",
        form: {
            title_discord_id: "Your discord ID",
            punish_date: "Approximate date of receiving punishment",
            reason: "Reason of punishment",
            reason_desc: "Describe in detail the reason why you were punished...",
            moderator: "Moderator, which punished you?",
            moderator_desc: "Moderator nickname or ID",
            mistake: "Did you understand your mistake?"
        },
        button_send: "Send the request"
    },

    dashboard: {
        main_title: "Welcome, ",
        main_desc: "Your servers",
        guild_loading: {
            checking: "Checking...",
            setup: "Setup",
            add: "Add"
        },
        no_servers: "You have not servers, where you are owner."
    },

    guild: {
        back: "← Back",
        head_buttons: {
            main_settings: "Main settings",
            logging: "Logging",
            verification: "Verification",
            backups: "Backups"
        },

        main_settings: {
            title: "Main settings",
            language: "Bot language:",
            people_ban: "Invites blocking and blacklisted members:",
            whitelist: "Roles whitelist:",
            search_placeholder: "Search role...",
            no_roles: "No available roles or search matches",
            saving: "Saving...",
            save_settings: "Save settings"
        },

        logging: {
            title: "Logging settings",
            current_webhook: "Current webhook for logs:",
            webhook_data: {
                name: "Name:",
                channel: "Channel:",
                url: "Webhook URL:"
            },
            not_setup: "Webhook not setup.",
            choose_webhook: "Setup new webhook:"
        },

        verification: {
            title: "Verification settings",
            verifed_members: "Verified members role:",
            new_members: "New members role:",
            choose_role: ">-- Choose role --<",
            choose_channel: ">-- Choose channel --<",
            channel: "Verification channel",
            enable_captcha: "Enable captcha system"
        },

        backups: {
            title: "Backups",
            no_perms: "To work with backups, bot needs <strong>Administrator</strong> rights.",
            backups_list: "Backup list",
            loading: "Loading...",
            no_backups: "No backups available",
            date: "Date of creation",
            actions: "Actions",
            recovery: "Recovery...",
            wait: "Wait",
            restore: "Restore",
            cooldown: "Re-use will be available in {{ cooldownTime }} seconds.",
            delete: "Delete",
            creating: "Creating...",
            create: "Create backup",
            all_backups: "Backups:"
        }
    },

    backups: {
        title: "Antilink - Backups",
        page_title: "Backups",
        page_description: "Manage your server backups. Create, restore, and monitor backup status.",
        loading: "Loading backups...",
        status_completed: "Completed",
        created: "Created",
        type: "Type",

        // Статистика
        stats_categories: "Categories",
        stats_channels: "Channels",
        stats_roles: "Roles",
        stats_emojis: "Emojis",

        // Дії
        action_restore: "Restore",
        action_details: "Details",
        action_delete: "Delete",

        // Дебаг інформація
        debug_title: "Debug information for backup {{id}}:",
        debug_details_loaded: "Details loaded:",
        debug_roles_count: "Number of roles:",
        debug_first_roles: "First 3 roles:",
        debug_color: "Color",

        // Секції
        section_roles: "Roles",
        section_channels: "Channels",
        section_emojis: "Emojis",

        // Ролі
        role_position: "Position",
        role_permissions: "Permissions",
        role_hoist: "Separated",
        role_mentionable: "Mentionable",
        role_admin: "Administrator",

        // Емодзі
        emoji_animated: "Animated",
        emoji_static: "Static",
        emoji_managed: "Managed",

        // Пустий стан
        empty_state_title: "No backups yet",
        empty_state_description: "Create your first backup to protect your server data",

        // Списки
        no_roles: "No roles",
        no_channels: "No channels",
        no_emojis: "No emojis",

        // Модальне вікно
        channels_count: "channels",
        categories_count: "categories",
        channel_category: "Category"
    },

    docs: {
        title: "AntiLink - Documentation",
        main_title: "AntiLink — Documentation",
        main_description: "A powerful bot to protect your Discord server from unwanted guests and spam.",
        note_automatic_protection: "AntiLink automatically protects your server using an advanced moderation system and user database.",

        features_title: "Main Features",
        feature_unwanted_users: "Protection from unwanted users",
        feature_unwanted_users_desc: "automatic blocking of suspicious accounts",
        feature_warning_system: "Warning system",
        feature_warning_system_desc: "maintaining a database with punishment reasons",
        feature_blacklist: "Blacklist",
        feature_blacklist_desc: "users with 3+ warnings are automatically blocked",
        feature_cross_server: "Cross-server database",
        feature_cross_server_desc: "blocking on all servers with activated protection",
        feature_crash_bots: "Crash bot protection",
        feature_crash_bots_desc: "automatic detection and blocking of hacking attempts",

        work_concept_title: "Working concept",
        concept_step1: "The bot monitors all messages where it has access",
        concept_step2: "When an invitation is detected, and if the member doesn't have a whitelisted role - the bot deletes the invitation and issues 1 warning",
        concept_step3_highlight: "Third warning:",
        concept_step3_text: "- addition to blacklist and blocking",
        concept_step4: "If a user joins the guild, writes a message, and after verification the bot detects 3 warnings - they are blocked.",

        warning_blacklist: "Users from the blacklist will be automatically blocked on all servers where AntiLink is added with activated protection settings.",
        warning_default_settings: "By default, all bot settings are disabled. You need to configure the bot for it to work on your guild.",

        whitelist_title: "Role whitelist",
        whitelist_note: "Roles added to the whitelist bypass all AntiLink checks. Users with these roles do not receive warnings.",
        whitelist_add: "Add role to whitelist",
        whitelist_remove: "Remove role from whitelist",
        role: "role",
        whitelist_warning: "Be careful when adding roles to the whitelist. Users with these roles will be able to bypass all bot restrictions.",
        whitelist_permissions: "Whitelist settings are only available to server administrators with appropriate permissions.",

        settings_management_title: "Settings management",
        command_settings: "view and change bot settings",
        command_setup: "change bot settings on the guild",
        command_owner_only: "Only available to server owner",

        web_panel_text: "You can also change settings through the ",
        web_panel_link: "web panel",
        web_panel_text_after: ", which provides a more convenient interface.",

        note_attention: "Attention",
        note_owner_only: "Only the guild owner can change bot settings. This prevents unauthorized interference with the security system.",

        user_database_title: "User database",
        user_database_desc: "AntiLink stores detailed information about each violation:",
        db_field_date: "Date and time of violation",
        db_field_type: "Type of violation",
        db_field_user_id: "User identifier",
        db_field_moderator: "Moderator who issued the warning",
        db_field_notes: "Additional notes"
    },

    header: {
        support: "Support",
        appeal: "Appeal",
        login_via_discord: "Login via discord",
        login: "Login",
        my_guilds: "My servers",
        my_backups: "My backups",
        logout: "Logout"
    },

    footer: {
        temps: "Terms of use",
        privacy: "Privacy Policy",
        rights: "All rights reserved."
    },

    privacy: {
        title: "Privacy Policy - AntiLink",
        main_title: "AntiLink Privacy Policy",
        intro_text: "This topic describes the terms of use and privacy policy of the AntiLink bot. By using the bot, you automatically agree to these terms.",
        priority_text: "For our team, privacy and security are the highest priorities. Below is information about the data collected and stored in the AntiLink bot database.",

        data_collection_title: "Data Collection and Processing",
        data_collection_desc: "AntiLink stores the following technical data necessary for the bot's operation:",
        data_discord_id: "User Discord ID",
        data_discord_id_desc: "- technical identifier of the Discord account (does not contain personal information)",
        data_server_id: "Server IDs",
        data_server_id_desc: "- identifiers of Discord servers where the bot is used",
        data_role_id: "Role IDs",
        data_role_id_desc: "- identifiers of server roles added to the whitelist",
        data_evidence: "Violation evidence",
        data_evidence_desc: "- screenshots (stored only in cases of rule violations)",

        important_note: "Important: The bot <strong>does not collect</strong> or store such personal data as:",
        not_collected_real_names: "Users' real names",
        not_collected_emails: "Email addresses",
        not_collected_phones: "Phone numbers",
        not_collected_addresses: "Physical addresses",
        not_collected_payment: "Payment data",

        last_updated: "Last updated: January 1, 2025"
    },

    tos: {
        title: "Terms of Service - AntiLink",
        main_title: "Terms of Service",
        intro_text: "This topic contains the Terms of Service for the Discord bot AntiLink.",

        general_provisions_title: "General Provisions",
        general_provisions_desc: "First of all, by using the AntiLink bot, you automatically agree to:",
        agreement_tos: "AntiLink Terms of Service",
        agreement_privacy: "AntiLink Privacy Policy",
        agreement_discord: "Discord Terms of Service",
        disagreement_warning: "If you do not agree to the Terms of Service or Privacy Policy - you are prohibited from using our program.",

        prohibited_actions_title: "Prohibited Actions",
        penalties_text: "Violation of these rules may result in penalties such as:",
        penalty_removal: "Removal of the bot from your Discord server",
        penalty_blacklist: "Addition to the blacklist",
        penalty_other: "Other sanctions at the developer's discretion",
        prohibited_1_title: "Prohibited",
        prohibited_1_desc: "to create obstacles in the operation/crash the bot",
        prohibited_2_title: "Prohibited",
        prohibited_2_desc: "to use the AntiLink bot with the purpose of harming other Discord users",
        prohibited_3_title: "Prohibited",
        prohibited_3_desc: "to intentionally use bot vulnerabilities, bugs for the purpose of obtaining unfair advantage",
        changes_note: "We may make changes to the Terms of Service for certain reasons, notifying about it on the official Discord technical support server.",

        blacklist_title: "Blacklist",
        blacklist_desc: "A user may be added to the blacklist for the following reasons:",
        blacklist_reason_1: "Violation of Discord rules",
        blacklist_reason_2: "Server raids",
        blacklist_reason_3: "Crash-bot",
        blacklist_reason_4: "Distribution, advertising, development, dissemination, etc. of prohibited software for harming Discord users or guilds",
        blacklist_reason_5: "Advertising in private messages/on servers",
        blacklist_reason_6_title: "Aggressive russophiles",
        blacklist_reason_6_desc: "(those who furiously use anti-Ukrainian statements, insults to the Ukrainian nation, etc.)",

        access_restrictions_title: "Access Restrictions",
        access_restrictions_desc: "We have the right to restrict your use of our program due to:",
        restriction_reason_1: "Violation of Discord rules",
        restriction_reason_2: "Violation of our AntiLink Terms of Service or privacy policy",
        restriction_reason_3: "Compliance with Discord requirements",
        restriction_reason_4: "Grounds to believe that you are harming our program"
    },

    error: {
        title: "Error"
    }

}
