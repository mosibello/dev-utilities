"use client";
import React from "react";
import { Controller } from "react-hook-form";
import parse from "html-react-parser";
import Button from "./Button";
import { baseUrl } from "@/lib/constants";
import Select from "@/components/ui/Select";

const Form = ({
  formFields,
  register,
  errors,
  isValid,
  onSubmit,
  payloadPosting,
  formMessage,
  buttonTitle = "Get Started",
  disableSubmissionOnEnter,
  control,
}) => {
  const checkKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="c__form">
      {formFields && formFields.constructor === Array ? (
        <form
          onSubmit={onSubmit}
          autoComplete="off"
          onKeyDown={disableSubmissionOnEnter ? (e) => checkKeyDown(e) : null}
        >
          <div className="c__form__fields-wrapper">
            {formFields.map((elem) => {
              const {
                name,
                label,
                placeholder,
                type,
                width,
                required,
                pattern,
                defaultValue,
              } = elem;
              return (
                <div
                  key={name}
                  className={`c__form__fieldset c__form__fieldset--${width} ${
                    type === "hidden" ? `c__form__fieldset--hidden` : ``
                  }`}
                >
                  <div className="c__form__field">
                    {label && (
                      <label className="c__form__label" htmlFor={name}>
                        {label}
                      </label>
                    )}
                    <div className="c__form__input-wrapper">
                      {type === "textarea" ? (
                        <textarea
                          className={`c__form__input ${
                            errors[elem.name] ? `c__form__input--error` : ``
                          }`}
                          name={name}
                          type={type}
                          placeholder={placeholder}
                          defaultValue={defaultValue ? defaultValue : null}
                          {...register(name, {
                            required: required ? required.message : required,
                            pattern: pattern ? pattern : null,
                          })}
                        ></textarea>
                      ) : type === "select" ? (
                        (() => {
                          const { options, isMulti } = elem;
                          return (
                            <>
                              <Controller
                                name={name}
                                control={control}
                                rules={{
                                  required: required
                                    ? required.message
                                    : required,
                                  pattern: pattern ? pattern : null,
                                }}
                                defaultValue={
                                  defaultValue ? defaultValue : null
                                }
                                render={({ field }) => {
                                  return (
                                    <Select
                                      {...field}
                                      name={name}
                                      className={`c__form__select ${
                                        errors[name]
                                          ? `c__form__input--error`
                                          : ``
                                      }`}
                                      options={options}
                                      placeholder={placeholder}
                                      isMulti={isMulti}
                                      onChange={(selected) => {
                                        field.onChange(selected);
                                      }}
                                      onBlur={field.onBlur}
                                      defaultValue={
                                        defaultValue ? defaultValue : null
                                      }
                                      value={
                                        field.value ?? (isMulti ? [] : null)
                                      }
                                    />
                                  );
                                }}
                              />
                            </>
                          );
                        })()
                      ) : (
                        <input
                          className={`c__form__input ${
                            errors[elem.name] ? `c__form__input--error` : ``
                          }`}
                          name={name}
                          type={type}
                          placeholder={placeholder}
                          defaultValue={defaultValue ? defaultValue : null}
                          {...register(name, {
                            required: required ? required.message : required,
                            pattern: pattern ? pattern : null,
                          })}
                        />
                      )}
                    </div>
                  </div>
                  {errors[elem.name] && (
                    <div id={`${elem.name}-error`} className="c__form__error">
                      <span>{errors[elem.name].message}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {buttonTitle && (
            <div className="c__form__button-wrapper">
              <Button
                actionable
                title={buttonTitle}
                type="submit"
                isLoading={payloadPosting}
                // isDisabled={!isValid}
              />
            </div>
          )}
          {formMessage && (
            <div
              className={`c__form__message c__form__message--${formMessage.type}`}
            >
              {parse(formMessage.message)}
            </div>
          )}
        </form>
      ) : (
        <div className={`c__form__message c__form__message--error`}>
          Error rendering the form. <br />
          Please check form fields are set up corectly
        </div>
      )}
    </div>
  );
};

export default Form;
