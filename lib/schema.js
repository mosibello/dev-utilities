export const SCHEMA__imageCategories = [
  {
    value: "creative",
    label: "Creative",
  },
  {
    value: "street",
    label: "Street",
  },
  {
    value: "art",
    label: "Art",
  },
  {
    value: "humans",
    label: "Humans",
  },
  {
    value: "portrait",
    label: "Portrait",
  },
  {
    value: "caligraphy",
    label: "Caligraphy",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "animals",
    label: "Animals",
  },
  {
    value: "wedding",
    label: "Wedding",
  },
  {
    value: "nature",
    label: "Nature",
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
  },
  {
    value: "family",
    label: "Family",
  },
  {
    value: "wallpaper",
    label: "Wallpaper",
  },
  {
    value: "abstract",
    label: "Abstract",
  },
  {
    value: "couple",
    label: "Couple",
  },
  {
    value: "aesthetic",
    label: "Aesthetic",
  },
  {
    value: "funny",
    label: "Funny",
  },
  {
    value: "cute",
    label: "Cute",
  },
  {
    value: "baby",
    label: "Baby",
  },
  {
    value: "children",
    label: "Children",
  },
];

export const SCHEMA__DummyMenu = {
  title: "Header",
  _originalId: "1d800887-ce2d-4a02-8c16-5e4f6bc2675c",
  _updatedAt: "2024-08-31T00:11:29Z",
  items: [
    {
      _key: "d1ecc52f07b6",
      title: "Explore",
      _type: "link_list",
      destination: "/explore",
    },
    {
      _type: "link_list",
      destination: "/upload",
      _key: "a3fd00ca0cca33f99124c385ea2ca1e6",
      title: "Upload",
    },
  ],
};

export const SCHEMA__LoginForm = [
  {
    name: `email`,
    label: `Email Address`,
    placeholder: `Email Address`,
    width: 100,
    type: "email",
    required: {
      value: true,
      message: `Must enter a valid email`,
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: `Must enter a valid email`,
    },
  },
];

export const SCHEMA__SignupForm = [
  {
    name: `first_name`,
    label: `First Name`,
    placeholder: `First Name`,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: `Must only be alphabets`,
    },
    required: {
      value: true,
      message: `This field is required`,
    },
  },
  {
    name: `last_name`,
    label: `Last Name`,
    placeholder: `Last Name`,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: `Must only be alphabets`,
    },
    required: {
      value: true,
      message: `This field is required`,
    },
  },
  {
    name: `email`,
    label: `Email Address`,
    placeholder: `Email Address`,
    width: 100,
    type: "email",
    required: {
      value: true,
      message: `Must enter a valid email`,
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: `Must enter a valid email`,
    },
  },
  {
    name: `username_handle`,
    label: `Username Handle`,
    placeholder: `Username Handle`,
    width: 100,
    type: "text",
    required: {
      value: true,
      message: `This field is required`,
    },
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message: `Must be alphanumeric`,
    },
  },
];

export const SCHEMA__ProfileForm = [
  {
    name: `first_name`,
    label: `First Name`,
    placeholder: `First Name`,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: `Must only be alphabets`,
    },
    required: {
      value: true,
      message: `This field is required`,
    },
  },
  {
    name: `last_name`,
    label: `Last Name`,
    placeholder: `Last Name`,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z]+$/,
      message: `Must only be alphabets`,
    },
    required: {
      value: true,
      message: `This field is required`,
    },
  },
  {
    name: `short_bio`,
    label: `Short Bio`,
    placeholder: ``,
    width: 100,
    type: "textarea",
    pattern: {
      value: /^[\s\S]{0,130}$/,
      message: `Must be less than 130 characters`,
    },
  },
  {
    name: `city`,
    label: `City`,
    placeholder: ``,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: `Must only be alphabets`,
    },
  },
  {
    name: `country`,
    label: `Country`,
    placeholder: ``,
    width: 50,
    type: "text",
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: `Must only be alphabets`,
    },
  },
  {
    name: `website`,
    label: `Website`,
    placeholder: ``,
    width: 100,
    type: "text",
    pattern: {
      value: /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,6}(:\d+)?(\/\S*)?$/i,
      message: `Must be a valid link`,
    },
  },
];

export const SCHEMA__ImageEditorForm = [
  {
    name: `title`,
    label: `Image Title (Required)`,
    placeholder: ``,
    width: 100,
    type: "text",
    options: SCHEMA__imageCategories,
    required: {
      value: true,
      message: `This field is required`,
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: `Must only be alphabets`,
    },
  },
  {
    name: `description`,
    label: `Short Description (Optional)`,
    placeholder: ``,
    width: 100,
    type: "textarea",
    pattern: {
      value: /^[\s\S]{0,130}$/,
      message: `Must be less than 130 characters`,
    },
  },
  {
    name: `categories`,
    label: `Image Categories (Required)`,
    placeholder: `Select categories for your image`,
    width: 100,
    type: "select",
    isMulti: true,
    options: SCHEMA__imageCategories,
    required: {
      value: true,
      message: `This field is required`,
    },
  },
];
