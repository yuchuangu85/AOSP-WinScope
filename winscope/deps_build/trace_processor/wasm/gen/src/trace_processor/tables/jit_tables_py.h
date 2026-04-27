#ifndef SRC_TRACE_PROCESSOR_TABLES_JIT_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_JIT_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <tuple>
#include <type_traits>
#include <utility>
#include <variant>
#include <vector>

#include "perfetto/base/compiler.h"
#include "perfetto/base/logging.h"
#include "perfetto/public/compiler.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/dataframe/dataframe.h"
#include "src/trace_processor/dataframe/specs.h"
#include "src/trace_processor/dataframe/typed_cursor.h"
#include "src/trace_processor/tables/macros_internal.h"

#include "src/trace_processor/tables/profiler_tables_py.h"

namespace perfetto::trace_processor::tables {

class JitCodeTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","create_ts","estimated_delete_ts","utid","start_address","size","function_name","native_code_base64"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(JitCodeTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const JitCodeTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t create_ts = 1;
    static constexpr uint32_t estimated_delete_ts = 2;
    static constexpr uint32_t utid = 3;
    static constexpr uint32_t start_address = 4;
    static constexpr uint32_t size = 5;
    static constexpr uint32_t function_name = 6;
    static constexpr uint32_t native_code_base64 = 7;
  };
  struct RowReference {
   public:
    explicit RowReference(JitCodeTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t create_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::create_ts>(kSpec, row_);
    }
        std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_);
    }
        uint32_t utid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int64_t start_address() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id function_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::function_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    void set_estimated_delete_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    JitCodeTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const JitCodeTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t create_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::create_ts>(kSpec, row_);
    }
        std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_);
    }
        uint32_t utid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int64_t start_address() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id function_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::function_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const JitCodeTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t create_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::create_ts>(kSpec);
    }
    std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec);
    }
    uint32_t utid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
    int64_t start_address() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_address>(kSpec);
    }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
      StringPool::Id function_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::function_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t create_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::create_ts>(kSpec);
    }
    std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec);
    }
    uint32_t utid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
    int64_t start_address() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_address>(kSpec);
    }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
      StringPool::Id function_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::function_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    void set_estimated_delete_ts(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(JitCodeTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t create_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::create_ts>(kSpec, row_);
    }
        std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_);
    }
        uint32_t utid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int64_t start_address() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id function_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::function_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      void set_estimated_delete_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_, res);
    }

    private:
      JitCodeTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const JitCodeTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      JitCodeTable::Id id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t create_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::create_ts>(kSpec, row_);
    }
        std::optional<int64_t> estimated_delete_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::estimated_delete_ts>(kSpec, row_);
    }
        uint32_t utid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int64_t start_address() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id function_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::function_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const JitCodeTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _create_ts = {}, std::optional<int64_t> _estimated_delete_ts = {}, uint32_t _utid = {}, int64_t _start_address = {}, int64_t _size = {}, StringPool::Id _function_name = {}, std::optional<StringPool::Id> _native_code_base64 = {}) : create_ts(std::move(_create_ts)), estimated_delete_ts(std::move(_estimated_delete_ts)), utid(std::move(_utid)), start_address(std::move(_start_address)), size(std::move(_size)), function_name(std::move(_function_name)), native_code_base64(std::move(_native_code_base64)) {}

    bool operator==(const Row& other) const {
      return std::tie(create_ts, estimated_delete_ts, utid, start_address, size, function_name, native_code_base64) ==
             std::tie(other.create_ts, other.estimated_delete_ts, other.utid, other.start_address, other.size, other.function_name, other.native_code_base64);
    }

        int64_t create_ts;
    std::optional<int64_t> estimated_delete_ts;
    uint32_t utid;
    int64_t start_address;
    int64_t size;
    StringPool::Id function_name;
    std::optional<StringPool::Id> native_code_base64;
  };

  explicit JitCodeTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.create_ts, row.estimated_delete_ts, row.utid, row.start_address, row.size, row.function_name != StringPool::Id::Null() ? std::make_optional(row.function_name) : std::nullopt, row.native_code_base64 && row.native_code_base64 != StringPool::Id::Null() ? std::make_optional(*row.native_code_base64) : std::nullopt);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_jit_code";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};



class JitFrameTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","jit_code_id","frame_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(JitFrameTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const JitFrameTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t jit_code_id = 1;
    static constexpr uint32_t frame_id = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(JitFrameTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec, row_)};
      }
          StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    JitFrameTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const JitFrameTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec, row_)};
      }
          StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const JitFrameTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{cursor_.GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec)};
      }
      StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        return StackProfileFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::frame_id>(kSpec)};
      }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{cursor_.GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec)};
      }
      StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        return StackProfileFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::frame_id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(JitFrameTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec, row_)};
      }
          StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
      

    private:
      JitFrameTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const JitFrameTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      JitFrameTable::Id id() const {
        
        return JitFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          JitCodeTable::Id jit_code_id() const {
        
        return JitCodeTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::jit_code_id>(kSpec, row_)};
      }
          StackProfileFrameTable::Id frame_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }

    private:
      const JitFrameTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(JitCodeTable::Id _jit_code_id = {}, StackProfileFrameTable::Id _frame_id = {}) : jit_code_id(std::move(_jit_code_id)), frame_id(std::move(_frame_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(jit_code_id, frame_id) ==
             std::tie(other.jit_code_id, other.frame_id);
    }

        JitCodeTable::Id jit_code_id;
    StackProfileFrameTable::Id frame_id;
  };

  explicit JitFrameTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.jit_code_id.value, row.frame_id.value);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_jit_frame";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_JIT_TABLES_PY_H_
