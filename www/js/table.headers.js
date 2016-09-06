module.exports = [
    {
        "id": "icon",
        "header": "ICON",
        "title": "Hero Icon",
        "align": "center",
        "display": ko.observable(true),
        "filter": false
    },
    {
        "id": "displayname",
        "header": "NAME",
        "title": "Hero Name",
        "align": "center",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "string",
        "filterValue": ko.observable()
    },
    {
        "id": "attributeprimary",
        "header": "PSTAT",
        "title": "Primary Stat",
        "align": "center",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "select",
        "filterValue": ko.observable(),
        "filterOptions": [
            {
                "text": 'Agility',
                "value": 'AGI'
            },
            {
                "text": 'Strength',
                "value": 'STR'
            },
            {
                "text": 'Intelligence',
                "value": 'INT'
            }
        ]
    },
    {
        "id": "totalAgi",
        "header": "AGI",
        "title": "Agility",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributeagilitygain",
        "header": "AGIG",
        "title": "Agility Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalInt",
        "header": "INT",
        "title": "Intelligence",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributeintelligencegain",
        "header": "INTG",
        "title": "Intelligence Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalStr",
        "header": "STR",
        "title": "Strength",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attributestrengthgain",
        "header": "STRG",
        "title": "Strength Gain",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "health",
        "header": "HP",
        "title": "Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "healthregen",
        "header": "HPR",
        "title": "Health Regen",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "mana",
        "header": "MP",
        "title": "Mana",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "manaregen",
        "header": "MPR",
        "title": "Mana Regen",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalArmorPhysical",
        "header": "ARMR",
        "title": "Armor",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalArmorPhysicalReduction",
        "header": "%PR",
        "title": "%Physical Damage Reduction",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalMovementSpeed",
        "header": "MS",
        "title": "Movement Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalTurnRate",
        "header": "TR",
        "title": "Turn Rate",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageAvg",
        "header": "BAVG",
        "title": "Base Damage Average",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageMin",
        "header": "BMIN",
        "title": "Base Damage Min",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "baseDamageMax",
        "header": "BMAX",
        "title": "Base Damage Max",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bonusDamage",
        "header": "BD",
        "title": "Bonus Damage",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bonusDamageReduction",
        "header": "BDR",
        "title": "Bonus Damage Reduction",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageAvg",
        "header": "DAVG",
        "title": "Damage Average",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageMin",
        "header": "DMIN",
        "title": "Damage Min",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "damageMax",
        "header": "DMAX",
        "title": "Damage Max",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalMagicResistance",
        "header": "%MR",
        "title": "Magic Resistance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bat",
        "header": "BAT",
        "title": "Base Attack Time",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ias",
        "header": "IAS",
        "title": "Increased Attack Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attacktype",
        "header": "ATKT",
        "title": "Attack Type",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "select",
        "filterValue": ko.observable(),
        "filterOptions": [
            {
                "text": 'Ranged',
                "value": 'RANGED'
            },
            {
                "text": 'Melee',
                "value": 'MELEE'
            }
        ]
    },
    {
        "id": "attackTime",
        "header": "AT",
        "title": "Attack Time",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attacksPerSecond",
        "header": "APS",
        "title": "Attacks Per Second",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attackpoint",
        "header": "ATKP",
        "title": "Attack Point",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "projectilespeed",
        "header": "PSPD",
        "title": "Projectile Speed",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "evasion",
        "header": "EVA",
        "title": "Evasion",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ehpPhysical",
        "header": "PEHP",
        "title": "Physical Effective Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "ehpMagical",
        "header": "MEHP",
        "title": "Magical Effective Health",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "bash",
        "header": "BASH",
        "title": "Bash Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "critChance",
        "header": "%CRT",
        "title": "Crit Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "critDamage",
        "header": "CRTD",
        "title": "Crit Damage",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "missChance",
        "header": "MISS",
        "title": "Miss Chance",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "totalattackrange",
        "header": "RNGE",
        "title": "Attack Range",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "visionrangeday",
        "header": "VISD",
        "title": "Vision Range Day",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "visionrangenight",
        "header": "VISN",
        "title": "Vision Range Night",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "lifesteal",
        "header": "LS",
        "title": "Lifesteal",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "attackdamage",
        "header": "ATKD",
        "title": "Attack Damage",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    },
    {
        "id": "dps",
        "header": "DPS",
        "title": "Damage Per Second",
        "align": "right",
        "display": ko.observable(true),
        "filter": true,
        "filterType": "numeric",
        "filterValue": ko.observable(),
        "filterComparison": ko.observable()
    }
]