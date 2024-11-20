import type { SequenceElement, StringSplitter } from './components/TypeAnimation/index.types';
import { Wrapper } from './components/TypeAnimation/index.types';
export declare function type(node: HTMLElementTagNameMap[Wrapper], splitter: StringSplitter, speed: number, deletionSpeed: number, omitDeletionAnimation: boolean, ...args: ReadonlyArray<SequenceElement | typeof type>): Promise<void>;
