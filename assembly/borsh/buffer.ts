export class EncodeBuffer {
  public offset:u32 = 0;
  public buffer_size:u32 = 2;
  public start:usize = heap.alloc(this.buffer_size);

  resize_if_necessary(needed_space:u32):void{
    if(this.buffer_size - this.offset < needed_space){
      this.buffer_size = max(this.buffer_size*2, this.buffer_size + needed_space)
      this.start = heap.realloc(this.start, this.buffer_size)
    }
  }
  
  store<T>(value:T):void{
    this.resize_if_necessary(sizeof<T>())
    store<T>(this.start + this.offset, value)
    this.offset += sizeof<T>()
  }

  copy(src:usize, nBytes:u32):void{
    this.resize_if_necessary(nBytes)
    memory.copy(this.start + this.offset, src, nBytes)
    this.offset += nBytes
  }

  get_used_buffer():ArrayBuffer{
    return changetype<ArrayBuffer>(this.start).slice(0, this.offset)
  }

  store_bytes<T>(t: T, nBytes: u32): void { 
    if (!isReference<T>() && !(t instanceof usize)) { 
      ERROR(`Type ${nameof<T>()} must be a reference type or usize`);
    }
    this.copy(changetype<usize>(t), nBytes);
  }


}

export class DecodeBuffer {
  public offset:u32 = 0;
  public start:usize;

  constructor(public arrBuffer: ArrayBuffer) {
    this.start = changetype<usize>(arrBuffer)
  }
 
  consume<T>():T{
    const off = this.offset
    this.offset += sizeof<T>()
    return load<T>(this.start + off)
  }

  consume_slice(length:u32): ArrayBuffer {
    const off = this.offset
    this.offset += length
    return changetype<ArrayBuffer>(this.start).slice(off, off + length)
  }
}