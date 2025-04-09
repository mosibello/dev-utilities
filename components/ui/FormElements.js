"use client";
import React from "react";
import Select from "react-select";

export const Input = ({
  name,
  autoComplete,
  type,
  placeholder,
  defaultValue,
  required,
  pattern,
  errors,
  readOnly,
}) => {
  return (
    <input
      name={name}
      id={name}
      aria-labelledby={name}
      autoComplete={autoComplete}
      className={`c__form__input ${
        errors[elem.name] ? `c__form__input--error` : ``
      }`}
      type={type}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      defaultValue={defaultValue ? defaultValue : null}
      {...register(name, {
        required: required ? required.message : required,
        pattern: pattern ? pattern : null,
      })}
    />
  );
};

export const Textarea = ({
  name,
  autoComplete,
  type,
  placeholder,
  defaultValue,
  required,
  pattern,
  errors,
  readOnly,
}) => {
  return (
    <textarea
      name={name}
      id={name}
      aria-labelledby={name}
      className={`c__form__input ${
        errors[elem.name] ? `c__form__input--error` : ``
      }`}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      readOnly={readOnly}
      defaultValue={defaultValue ? defaultValue : null}
      {...register(name, {
        required: required ? required.message : required,
        pattern: pattern ? pattern : null,
      })}
    ></textarea>
  );
};

export const Select = ({
  isMulti,
  options,
  className,
  defaultValue = [],
  onChange,
  onBlur,
  value,
  name,
}) => (
  <Select
    defaultValue={defaultValue}
    isMulti={isMulti}
    name={name}
    id={name}
    options={options}
    className={`basic-multi-select ${className}`}
    classNamePrefix="select"
    closeMenuOnSelect={!isMulti}
    onChange={onChange}
    onBlur={onBlur}
    value={value}
  />
);
