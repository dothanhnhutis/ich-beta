import { PermissionError } from "@/error-handler";
import { readPoliciesByUserIdService } from "@/services/policies";
import { RequestHandler as Middleware } from "express";
type Operator =
  | "equals"
  | "not_equal"
  | "contains"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal"
  | "in"
  | "not_in";

type BaseCondition = {
  attribute: string; // Ví dụ: "createdAt", "$.user.role", "$.env"
  operator: Operator;
  value: any; // Giá trị có thể là chuỗi, số, hoặc bất kỳ kiểu nào khác
};

// Điều kiện tổ hợp: AND, OR, NOT
type AndCondition = {
  and: Condition[]; // Tất cả điều kiện con phải đúng
};

type OrCondition = {
  or: Condition[]; // Ít nhất một điều kiện con phải đúng
};

type NotCondition = {
  not: Condition; // Điều kiện phải sai
};

// Union type: Kết hợp tất cả loại điều kiện
export type Condition =
  | BaseCondition
  | AndCondition
  | OrCondition
  | NotCondition;

export function evaluateCondition(
  user: Record<string, any>,
  condition: Condition,
  resource?: Record<string, any>
): boolean {
  if ("and" in condition) {
    return condition.and.every((subCondition) =>
      evaluateCondition(user, subCondition, resource)
    );
  }

  if ("or" in condition) {
    return condition.or.some((subCondition) =>
      evaluateCondition(user, subCondition, resource)
    );
  }

  if ("not" in condition) {
    return !evaluateCondition(user, condition.not, resource);
  }

  const { attribute, operator, value } = condition;

  const dynamicValue = attribute.startsWith("$.")
    ? attribute.startsWith("$.users")
      ? user[attribute.slice(8)]
      : resource?.[attribute.split(".").pop()!]
    : resource?.[attribute];

  const conditionValue =
    typeof value === "string" && value.startsWith("$.")
      ? attribute.startsWith("$.users")
        ? user[attribute.slice(8)]
        : resource?.[attribute.split(".").pop()!] || value
      : value;

  if (!dynamicValue || !conditionValue) return false;

  switch (operator) {
    case "equals":
      return dynamicValue === conditionValue;
    case "not_equal":
      return dynamicValue !== conditionValue;
    case "greater_than":
      return dynamicValue > conditionValue;
    case "greater_than_or_equal":
      return dynamicValue >= conditionValue;
    case "less_than":
      return dynamicValue < conditionValue;
    case "less_than_or_equal":
      return dynamicValue <= conditionValue;
    case "in":
      return (
        Array.isArray(conditionValue) && conditionValue.includes(dynamicValue)
      );
    case "not_in":
      return (
        Array.isArray(conditionValue) && !conditionValue.includes(dynamicValue)
      );
    case "contains":
      return (
        Array.isArray(dynamicValue) && dynamicValue.includes(conditionValue)
      );
    default:
      return false; // Không hỗ trợ operator này
  }
}

declare global {
  namespace Express {
    interface Request {
      condition: Condition | null;
    }
  }
}

export const checkPolicy =
  (action: string, resource: string): Middleware =>
  async (req, _, next) => {
    if (!req.user) throw new PermissionError();
    const policy = await readPoliciesByUserIdService(
      req.user.id,
      action,
      resource
    );

    console.log(policy);
    if (!policy) throw new PermissionError();

    req.condition = policy.condition ? (policy.condition as Condition) : null;
    next();
  };
