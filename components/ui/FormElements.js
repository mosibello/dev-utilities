"use client";
import React from "react";
import Select from "react-select";

export const Label = ({ name, children }) => {
  return (
    <label
      className="c__form__label text-sm mb-2 flex font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      htmlFor={name}
    >
      {children}
    </label>
  );
};

export const Input = ({
  name,
  autoComplete,
  type,
  placeholder,
  onChange,
  defaultValue,
  required,
  pattern,
  errors,
  readOnly,
  value,
  className,
}) => {
  return (
    <input
      name={name}
      id={name}
      aria-labelledby={name}
      autoComplete={autoComplete}
      className={`c__form__input ${className ? className : ``} ${
        errors?.name ? `c__form__input--error` : ``
      }`}
      type={type}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue ? defaultValue : null}
      {...(typeof register === "function"
        ? register(name, {
            required: required?.message ?? required,
            pattern: pattern ?? undefined,
          })
        : {})}
    />
  );
};

export const Textarea = ({
  name,
  autoComplete,
  type,
  placeholder,
  required,
  pattern,
  errors,
  readOnly,
  onChange,
  rows,
  value,
  className,
}) => {
  return (
    <textarea
      name={name}
      id={name}
      aria-labelledby={name}
      className={`c__form__input ${className ? className : ``} ${
        errors?.name ? `c__form__input--error` : ``
      }`}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      readOnly={readOnly}
      onChange={onChange}
      rows={rows}
      value={value}
      {...(typeof register === "function"
        ? register(name, {
            required: required?.message ?? required,
            pattern: pattern ?? undefined,
          })
        : {})}
    ></textarea>
  );
};

export default ({
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
