/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface PauserRoleInterface extends ethers.utils.Interface {
  functions: {
    "isPauser(address)": FunctionFragment;
    "renouncePauser()": FunctionFragment;
    "addPauser(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "isPauser", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renouncePauser",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "addPauser", values: [string]): string;

  decodeFunctionResult(functionFragment: "isPauser", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renouncePauser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addPauser", data: BytesLike): Result;

  events: {
    "PauserAdded(address)": EventFragment;
    "PauserRemoved(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PauserAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PauserRemoved"): EventFragment;
}

export type PauserAddedEvent = TypedEvent<[string] & { account: string }>;

export type PauserRemovedEvent = TypedEvent<[string] & { account: string }>;

export class PauserRole extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: PauserRoleInterface;

  functions: {
    isPauser(account: string, overrides?: CallOverrides): Promise<[boolean]>;

    renouncePauser(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addPauser(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  isPauser(account: string, overrides?: CallOverrides): Promise<boolean>;

  renouncePauser(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addPauser(
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isPauser(account: string, overrides?: CallOverrides): Promise<boolean>;

    renouncePauser(overrides?: CallOverrides): Promise<void>;

    addPauser(account: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "PauserAdded(address)"(
      account?: string | null
    ): TypedEventFilter<[string], { account: string }>;

    PauserAdded(
      account?: string | null
    ): TypedEventFilter<[string], { account: string }>;

    "PauserRemoved(address)"(
      account?: string | null
    ): TypedEventFilter<[string], { account: string }>;

    PauserRemoved(
      account?: string | null
    ): TypedEventFilter<[string], { account: string }>;
  };

  estimateGas: {
    isPauser(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    renouncePauser(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addPauser(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isPauser(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renouncePauser(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addPauser(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
