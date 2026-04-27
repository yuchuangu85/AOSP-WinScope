#ifndef SRC_TRACE_PROCESSOR_TABLES_PROFILER_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_PROFILER_TABLES_PY_H_

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

#include "src/trace_processor/tables/track_tables_py.h"

namespace perfetto::trace_processor::tables {

class StackProfileMappingTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","build_id","exact_offset","start_offset","start","end","load_bias","name"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(StackProfileMappingTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const StackProfileMappingTable& table) const {
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
    static constexpr uint32_t build_id = 1;
    static constexpr uint32_t exact_offset = 2;
    static constexpr uint32_t start_offset = 3;
    static constexpr uint32_t start = 4;
    static constexpr uint32_t end = 5;
    static constexpr uint32_t load_bias = 6;
    static constexpr uint32_t name = 7;
  };
  struct RowReference {
   public:
    explicit RowReference(StackProfileMappingTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id build_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::build_id>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t exact_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::exact_offset>(kSpec, row_);
    }
        int64_t start_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_offset>(kSpec, row_);
    }
        int64_t start() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start>(kSpec, row_);
    }
        int64_t end() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end>(kSpec, row_);
    }
        int64_t load_bias() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::load_bias>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    StackProfileMappingTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const StackProfileMappingTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id build_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::build_id>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t exact_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::exact_offset>(kSpec, row_);
    }
        int64_t start_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_offset>(kSpec, row_);
    }
        int64_t start() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start>(kSpec, row_);
    }
        int64_t end() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end>(kSpec, row_);
    }
        int64_t load_bias() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::load_bias>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const StackProfileMappingTable* table_;
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
    StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id build_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::build_id>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t exact_offset() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::exact_offset>(kSpec);
    }
    int64_t start_offset() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_offset>(kSpec);
    }
    int64_t start() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start>(kSpec);
    }
    int64_t end() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::end>(kSpec);
    }
    int64_t load_bias() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::load_bias>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
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

    StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id build_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::build_id>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t exact_offset() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::exact_offset>(kSpec);
    }
    int64_t start_offset() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_offset>(kSpec);
    }
    int64_t start() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start>(kSpec);
    }
    int64_t end() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::end>(kSpec);
    }
    int64_t load_bias() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::load_bias>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(StackProfileMappingTable* table) : table_(table) {
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
      StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id build_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::build_id>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t exact_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::exact_offset>(kSpec, row_);
    }
        int64_t start_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_offset>(kSpec, row_);
    }
        int64_t start() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start>(kSpec, row_);
    }
        int64_t end() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end>(kSpec, row_);
    }
        int64_t load_bias() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::load_bias>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      

    private:
      StackProfileMappingTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const StackProfileMappingTable* table) : table_(table) {
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
      StackProfileMappingTable::Id id() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id build_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::build_id>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t exact_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::exact_offset>(kSpec, row_);
    }
        int64_t start_offset() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_offset>(kSpec, row_);
    }
        int64_t start() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start>(kSpec, row_);
    }
        int64_t end() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end>(kSpec, row_);
    }
        int64_t load_bias() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::load_bias>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const StackProfileMappingTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _build_id = {}, int64_t _exact_offset = {}, int64_t _start_offset = {}, int64_t _start = {}, int64_t _end = {}, int64_t _load_bias = {}, StringPool::Id _name = {}) : build_id(std::move(_build_id)), exact_offset(std::move(_exact_offset)), start_offset(std::move(_start_offset)), start(std::move(_start)), end(std::move(_end)), load_bias(std::move(_load_bias)), name(std::move(_name)) {}

    bool operator==(const Row& other) const {
      return std::tie(build_id, exact_offset, start_offset, start, end, load_bias, name) ==
             std::tie(other.build_id, other.exact_offset, other.start_offset, other.start, other.end, other.load_bias, other.name);
    }

        StringPool::Id build_id;
    int64_t exact_offset;
    int64_t start_offset;
    int64_t start;
    int64_t end;
    int64_t load_bias;
    StringPool::Id name;
  };

  explicit StackProfileMappingTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.build_id != StringPool::Id::Null() ? std::make_optional(row.build_id) : std::nullopt, row.exact_offset, row.start_offset, row.start, row.end, row.load_bias, row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt);
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
    return "stack_profile_mapping";
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



class StackProfileFrameTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name","mapping","rel_pc","symbol_set_id","deobfuscated_name"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(StackProfileFrameTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const StackProfileFrameTable& table) const {
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
    static constexpr uint32_t name = 1;
    static constexpr uint32_t mapping = 2;
    static constexpr uint32_t rel_pc = 3;
    static constexpr uint32_t symbol_set_id = 4;
    static constexpr uint32_t deobfuscated_name = 5;
  };
  struct RowReference {
   public:
    explicit RowReference(StackProfileFrameTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::mapping>(kSpec, row_)};
      }
        int64_t rel_pc() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::rel_pc>(kSpec, row_);
    }
        std::optional<uint32_t> symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_symbol_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_, res);
    }
          void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    StackProfileFrameTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const StackProfileFrameTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::mapping>(kSpec, row_)};
      }
        int64_t rel_pc() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::rel_pc>(kSpec, row_);
    }
        std::optional<uint32_t> symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const StackProfileFrameTable* table_;
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
    StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{cursor_.GetCellUnchecked<ColumnIndex::mapping>(kSpec)};
      }
    int64_t rel_pc() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::rel_pc>(kSpec);
    }
    std::optional<uint32_t> symbol_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec);
    }
      std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
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

    StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{cursor_.GetCellUnchecked<ColumnIndex::mapping>(kSpec)};
      }
    int64_t rel_pc() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::rel_pc>(kSpec);
    }
    std::optional<uint32_t> symbol_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec);
    }
      std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
    void set_symbol_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, res);
    }
      void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(StackProfileFrameTable* table) : table_(table) {
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
      StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::mapping>(kSpec, row_)};
      }
        int64_t rel_pc() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::rel_pc>(kSpec, row_);
    }
        std::optional<uint32_t> symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_symbol_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_, res);
    }
          void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_, res_value);
    }

    private:
      StackProfileFrameTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const StackProfileFrameTable* table) : table_(table) {
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
      StackProfileFrameTable::Id id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StackProfileMappingTable::Id mapping() const {
        
        return StackProfileMappingTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::mapping>(kSpec, row_)};
      }
        int64_t rel_pc() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::rel_pc>(kSpec, row_);
    }
        std::optional<uint32_t> symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }

    private:
      const StackProfileFrameTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}, StackProfileMappingTable::Id _mapping = {}, int64_t _rel_pc = {}, std::optional<uint32_t> _symbol_set_id = {}, std::optional<StringPool::Id> _deobfuscated_name = {}) : name(std::move(_name)), mapping(std::move(_mapping)), rel_pc(std::move(_rel_pc)), symbol_set_id(std::move(_symbol_set_id)), deobfuscated_name(std::move(_deobfuscated_name)) {}

    bool operator==(const Row& other) const {
      return std::tie(name, mapping, rel_pc, symbol_set_id, deobfuscated_name) ==
             std::tie(other.name, other.mapping, other.rel_pc, other.symbol_set_id, other.deobfuscated_name);
    }

        StringPool::Id name;
    StackProfileMappingTable::Id mapping;
    int64_t rel_pc;
    std::optional<uint32_t> symbol_set_id;
    std::optional<StringPool::Id> deobfuscated_name;
  };

  explicit StackProfileFrameTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.mapping.value, row.rel_pc, row.symbol_set_id, row.deobfuscated_name && row.deobfuscated_name != StringPool::Id::Null() ? std::make_optional(*row.deobfuscated_name) : std::nullopt);
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
    return "stack_profile_frame";
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



class StackProfileCallsiteTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","depth","parent_id","frame_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
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

    RowReference ToRowReference(StackProfileCallsiteTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const StackProfileCallsiteTable& table) const {
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
    static constexpr uint32_t depth = 1;
    static constexpr uint32_t parent_id = 2;
    static constexpr uint32_t frame_id = 3;
  };
  struct RowReference {
   public:
    explicit RowReference(StackProfileCallsiteTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
          StackProfileFrameTable::Id frame_id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
    void set_depth(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<StackProfileCallsiteTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    StackProfileCallsiteTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const StackProfileCallsiteTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
          StackProfileFrameTable::Id frame_id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const StackProfileCallsiteTable* table_;
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
    StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t depth() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
      std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
      StackProfileFrameTable::Id frame_id() const {
        
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

    StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t depth() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
      std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
      StackProfileFrameTable::Id frame_id() const {
        
        return StackProfileFrameTable::Id{cursor_.GetCellUnchecked<ColumnIndex::frame_id>(kSpec)};
      }
    void set_depth(uint32_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::depth>(kSpec, res);
    }
      void set_parent_id(std::optional<StackProfileCallsiteTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, res_value);
      }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(StackProfileCallsiteTable* table) : table_(table) {
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
      StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
          StackProfileFrameTable::Id frame_id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }
      void set_depth(uint32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<StackProfileCallsiteTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }

    private:
      StackProfileCallsiteTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const StackProfileCallsiteTable* table) : table_(table) {
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
      StackProfileCallsiteTable::Id id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t depth() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
          StackProfileFrameTable::Id frame_id() const {
        
        return StackProfileFrameTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::frame_id>(kSpec, row_)};
      }

    private:
      const StackProfileCallsiteTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _depth = {}, std::optional<StackProfileCallsiteTable::Id> _parent_id = {}, StackProfileFrameTable::Id _frame_id = {}) : depth(std::move(_depth)), parent_id(std::move(_parent_id)), frame_id(std::move(_frame_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(depth, parent_id, frame_id) ==
             std::tie(other.depth, other.parent_id, other.frame_id);
    }

        uint32_t depth;
    std::optional<StackProfileCallsiteTable::Id> parent_id;
    StackProfileFrameTable::Id frame_id;
  };

  explicit StackProfileCallsiteTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.depth, row.parent_id ? std::make_optional(row.parent_id->value) : std::nullopt, row.frame_id.value);
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
    return "stack_profile_callsite";
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



class CpuProfileStackSampleTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","callsite_id","utid","process_priority"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(CpuProfileStackSampleTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const CpuProfileStackSampleTable& table) const {
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
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t callsite_id = 2;
    static constexpr uint32_t utid = 3;
    static constexpr uint32_t process_priority = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(CpuProfileStackSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int32_t process_priority() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::process_priority>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    CpuProfileStackSampleTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const CpuProfileStackSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int32_t process_priority() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::process_priority>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const CpuProfileStackSampleTable* table_;
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
    CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec)};
      }
    uint32_t utid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
    int32_t process_priority() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::process_priority>(kSpec);
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

    CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec)};
      }
    uint32_t utid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
    int32_t process_priority() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::process_priority>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(CpuProfileStackSampleTable* table) : table_(table) {
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
      CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int32_t process_priority() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::process_priority>(kSpec, row_);
    }
      

    private:
      CpuProfileStackSampleTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const CpuProfileStackSampleTable* table) : table_(table) {
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
      CpuProfileStackSampleTable::Id id() const {
        
        return CpuProfileStackSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
        int32_t process_priority() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::process_priority>(kSpec, row_);
    }

    private:
      const CpuProfileStackSampleTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, StackProfileCallsiteTable::Id _callsite_id = {}, uint32_t _utid = {}, int32_t _process_priority = {}) : ts(std::move(_ts)), callsite_id(std::move(_callsite_id)), utid(std::move(_utid)), process_priority(std::move(_process_priority)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, callsite_id, utid, process_priority) ==
             std::tie(other.ts, other.callsite_id, other.utid, other.process_priority);
    }

        int64_t ts;
    StackProfileCallsiteTable::Id callsite_id;
    uint32_t utid;
    int32_t process_priority;
  };

  explicit CpuProfileStackSampleTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.callsite_id.value, row.utid, row.process_priority);
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
    return "cpu_profile_stack_sample";
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



class ExperimentalFlamegraphTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","profile_type","ts_in","ts_constraint","upid","upid_group","focus_str","ts","depth","name","map_name","count","cumulative_count","size","cumulative_size","alloc_count","cumulative_alloc_count","alloc_size","cumulative_alloc_size","parent_id","source_file","line_number"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ExperimentalFlamegraphTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ExperimentalFlamegraphTable& table) const {
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
    static constexpr uint32_t profile_type = 1;
    static constexpr uint32_t ts_in = 2;
    static constexpr uint32_t ts_constraint = 3;
    static constexpr uint32_t upid = 4;
    static constexpr uint32_t upid_group = 5;
    static constexpr uint32_t focus_str = 6;
    static constexpr uint32_t ts = 7;
    static constexpr uint32_t depth = 8;
    static constexpr uint32_t name = 9;
    static constexpr uint32_t map_name = 10;
    static constexpr uint32_t count = 11;
    static constexpr uint32_t cumulative_count = 12;
    static constexpr uint32_t size = 13;
    static constexpr uint32_t cumulative_size = 14;
    static constexpr uint32_t alloc_count = 15;
    static constexpr uint32_t cumulative_alloc_count = 16;
    static constexpr uint32_t alloc_size = 17;
    static constexpr uint32_t cumulative_alloc_size = 18;
    static constexpr uint32_t parent_id = 19;
    static constexpr uint32_t source_file = 20;
    static constexpr uint32_t line_number = 21;
  };
  struct RowReference {
   public:
    explicit RowReference(ExperimentalFlamegraphTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::profile_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t depth() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          StringPool::Id name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id map_name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::map_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t cumulative_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
        int64_t cumulative_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_);
    }
        int64_t alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_);
    }
        int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_);
    }
        int64_t alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_);
    }
        int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_);
    }
          std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
    void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
        void set_depth(uint32_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
          void set_name(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_map_name(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::map_name>(kSpec, row_, res_value);
    }
        void set_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::count>(kSpec, row_, res);
    }
        void set_cumulative_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_, res);
    }
        void set_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::size>(kSpec, row_, res);
    }
        void set_cumulative_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_, res);
    }
        void set_alloc_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_, res);
    }
        void set_cumulative_alloc_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_, res);
    }
        void set_alloc_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_, res);
    }
        void set_cumulative_alloc_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<ExperimentalFlamegraphTable::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
          void set_source_file(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::source_file>(kSpec, row_, res_value);
    }
        void set_line_number(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::line_number>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ExperimentalFlamegraphTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ExperimentalFlamegraphTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::profile_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t depth() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          StringPool::Id name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id map_name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::map_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t cumulative_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
        int64_t cumulative_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_);
    }
        int64_t alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_);
    }
        int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_);
    }
        int64_t alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_);
    }
        int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_);
    }
          std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ExperimentalFlamegraphTable* table_;
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
    ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::profile_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t depth() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
      StringPool::Id name() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id map_name() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::map_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::count>(kSpec);
    }
    int64_t cumulative_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec);
    }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
    int64_t cumulative_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec);
    }
    int64_t alloc_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::alloc_count>(kSpec);
    }
    int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec);
    }
    int64_t alloc_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::alloc_size>(kSpec);
    }
    int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec);
    }
      std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::source_file>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::line_number>(kSpec);
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

    ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::profile_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
    int64_t ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t depth() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::depth>(kSpec);
    }
      StringPool::Id name() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id map_name() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::map_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::count>(kSpec);
    }
    int64_t cumulative_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec);
    }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
    int64_t cumulative_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec);
    }
    int64_t alloc_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::alloc_count>(kSpec);
    }
    int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec);
    }
    int64_t alloc_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::alloc_size>(kSpec);
    }
    int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec);
    }
      std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::source_file>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::line_number>(kSpec);
    }
    void set_ts(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::ts>(kSpec, res);
    }
    void set_depth(uint32_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::depth>(kSpec, res);
    }
      void set_name(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
      void set_map_name(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::map_name>(kSpec, res_value);
    }
    void set_count(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::count>(kSpec, res);
    }
    void set_cumulative_count(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, res);
    }
    void set_size(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::size>(kSpec, res);
    }
    void set_cumulative_size(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, res);
    }
    void set_alloc_count(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::alloc_count>(kSpec, res);
    }
    void set_cumulative_alloc_count(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, res);
    }
    void set_alloc_size(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::alloc_size>(kSpec, res);
    }
    void set_cumulative_alloc_size(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, res);
    }
      void set_parent_id(std::optional<ExperimentalFlamegraphTable::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, res_value);
      }
      void set_source_file(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::source_file>(kSpec, res_value);
    }
    void set_line_number(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::line_number>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ExperimentalFlamegraphTable* table) : table_(table) {
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
      ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::profile_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t depth() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          StringPool::Id name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id map_name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::map_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t cumulative_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
        int64_t cumulative_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_);
    }
        int64_t alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_);
    }
        int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_);
    }
        int64_t alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_);
    }
        int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_);
    }
          std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
      void set_ts(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::ts>(kSpec, row_, res);
    }
        void set_depth(uint32_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::depth>(kSpec, row_, res);
    }
          void set_name(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_map_name(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::map_name>(kSpec, row_, res_value);
    }
        void set_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::count>(kSpec, row_, res);
    }
        void set_cumulative_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_, res);
    }
        void set_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::size>(kSpec, row_, res);
    }
        void set_cumulative_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_, res);
    }
        void set_alloc_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_, res);
    }
        void set_cumulative_alloc_count(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_, res);
    }
        void set_alloc_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_, res);
    }
        void set_cumulative_alloc_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_, res);
    }
          void set_parent_id(std::optional<ExperimentalFlamegraphTable::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
          void set_source_file(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::source_file>(kSpec, row_, res_value);
    }
        void set_line_number(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::line_number>(kSpec, row_, res);
    }

    private:
      ExperimentalFlamegraphTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ExperimentalFlamegraphTable* table) : table_(table) {
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
      ExperimentalFlamegraphTable::Id id() const {
        
        return ExperimentalFlamegraphTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id profile_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::profile_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> upid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t depth() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::depth>(kSpec, row_);
    }
          StringPool::Id name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id map_name() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::map_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t cumulative_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_count>(kSpec, row_);
    }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
        int64_t cumulative_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_size>(kSpec, row_);
    }
        int64_t alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_count>(kSpec, row_);
    }
        int64_t cumulative_alloc_count() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_count>(kSpec, row_);
    }
        int64_t alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::alloc_size>(kSpec, row_);
    }
        int64_t cumulative_alloc_size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cumulative_alloc_size>(kSpec, row_);
    }
          std::optional<ExperimentalFlamegraphTable::Id> parent_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(ExperimentalFlamegraphTable::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> source_file() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }

    private:
      const ExperimentalFlamegraphTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _profile_type = {}, std::optional<int64_t> _ts_in = {}, std::optional<StringPool::Id> _ts_constraint = {}, std::optional<uint32_t> _upid = {}, std::optional<StringPool::Id> _upid_group = {}, std::optional<StringPool::Id> _focus_str = {}, int64_t _ts = {}, uint32_t _depth = {}, StringPool::Id _name = {}, StringPool::Id _map_name = {}, int64_t _count = {}, int64_t _cumulative_count = {}, int64_t _size = {}, int64_t _cumulative_size = {}, int64_t _alloc_count = {}, int64_t _cumulative_alloc_count = {}, int64_t _alloc_size = {}, int64_t _cumulative_alloc_size = {}, std::optional<ExperimentalFlamegraphTable::Id> _parent_id = {}, std::optional<StringPool::Id> _source_file = {}, std::optional<uint32_t> _line_number = {}) : profile_type(std::move(_profile_type)), ts_in(std::move(_ts_in)), ts_constraint(std::move(_ts_constraint)), upid(std::move(_upid)), upid_group(std::move(_upid_group)), focus_str(std::move(_focus_str)), ts(std::move(_ts)), depth(std::move(_depth)), name(std::move(_name)), map_name(std::move(_map_name)), count(std::move(_count)), cumulative_count(std::move(_cumulative_count)), size(std::move(_size)), cumulative_size(std::move(_cumulative_size)), alloc_count(std::move(_alloc_count)), cumulative_alloc_count(std::move(_cumulative_alloc_count)), alloc_size(std::move(_alloc_size)), cumulative_alloc_size(std::move(_cumulative_alloc_size)), parent_id(std::move(_parent_id)), source_file(std::move(_source_file)), line_number(std::move(_line_number)) {}

    bool operator==(const Row& other) const {
      return std::tie(profile_type, ts_in, ts_constraint, upid, upid_group, focus_str, ts, depth, name, map_name, count, cumulative_count, size, cumulative_size, alloc_count, cumulative_alloc_count, alloc_size, cumulative_alloc_size, parent_id, source_file, line_number) ==
             std::tie(other.profile_type, other.ts_in, other.ts_constraint, other.upid, other.upid_group, other.focus_str, other.ts, other.depth, other.name, other.map_name, other.count, other.cumulative_count, other.size, other.cumulative_size, other.alloc_count, other.cumulative_alloc_count, other.alloc_size, other.cumulative_alloc_size, other.parent_id, other.source_file, other.line_number);
    }

        StringPool::Id profile_type;
    std::optional<int64_t> ts_in;
    std::optional<StringPool::Id> ts_constraint;
    std::optional<uint32_t> upid;
    std::optional<StringPool::Id> upid_group;
    std::optional<StringPool::Id> focus_str;
    int64_t ts;
    uint32_t depth;
    StringPool::Id name;
    StringPool::Id map_name;
    int64_t count;
    int64_t cumulative_count;
    int64_t size;
    int64_t cumulative_size;
    int64_t alloc_count;
    int64_t cumulative_alloc_count;
    int64_t alloc_size;
    int64_t cumulative_alloc_size;
    std::optional<ExperimentalFlamegraphTable::Id> parent_id;
    std::optional<StringPool::Id> source_file;
    std::optional<uint32_t> line_number;
  };

  explicit ExperimentalFlamegraphTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.profile_type != StringPool::Id::Null() ? std::make_optional(row.profile_type) : std::nullopt, row.ts_in, row.ts_constraint && row.ts_constraint != StringPool::Id::Null() ? std::make_optional(*row.ts_constraint) : std::nullopt, row.upid, row.upid_group && row.upid_group != StringPool::Id::Null() ? std::make_optional(*row.upid_group) : std::nullopt, row.focus_str && row.focus_str != StringPool::Id::Null() ? std::make_optional(*row.focus_str) : std::nullopt, row.ts, row.depth, row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.map_name != StringPool::Id::Null() ? std::make_optional(row.map_name) : std::nullopt, row.count, row.cumulative_count, row.size, row.cumulative_size, row.alloc_count, row.cumulative_alloc_count, row.alloc_size, row.cumulative_alloc_size, row.parent_id ? std::make_optional(row.parent_id->value) : std::nullopt, row.source_file && row.source_file != StringPool::Id::Null() ? std::make_optional(*row.source_file) : std::nullopt, row.line_number);
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
    return "experimental_flamegraph";
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



class GpuCounterGroupTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","group_id","track_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
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

    RowReference ToRowReference(GpuCounterGroupTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const GpuCounterGroupTable& table) const {
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
    static constexpr uint32_t group_id = 1;
    static constexpr uint32_t track_id = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(GpuCounterGroupTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    GpuCounterGroupTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const GpuCounterGroupTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const GpuCounterGroupTable* table_;
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
    GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(GpuCounterGroupTable* table) : table_(table) {
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
      GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      GpuCounterGroupTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const GpuCounterGroupTable* table) : table_(table) {
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
      GpuCounterGroupTable::Id id() const {
        
        return GpuCounterGroupTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const GpuCounterGroupTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int32_t _group_id = {}, TrackTable::Id _track_id = {}) : group_id(std::move(_group_id)), track_id(std::move(_track_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(group_id, track_id) ==
             std::tie(other.group_id, other.track_id);
    }

        int32_t group_id;
    TrackTable::Id track_id;
  };

  explicit GpuCounterGroupTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.group_id, row.track_id.value);
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
    return "gpu_counter_group";
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



class HeapGraphClassTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name","deobfuscated_name","location","superclass_id","classloader_id","kind"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(HeapGraphClassTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const HeapGraphClassTable& table) const {
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
    static constexpr uint32_t name = 1;
    static constexpr uint32_t deobfuscated_name = 2;
    static constexpr uint32_t location = 3;
    static constexpr uint32_t superclass_id = 4;
    static constexpr uint32_t classloader_id = 5;
    static constexpr uint32_t kind = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(HeapGraphClassTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> location() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> classloader_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_);
    }
          StringPool::Id kind() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::kind>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_, res_value);
    }
          void set_location(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::location>(kSpec, row_, res_value);
    }
          void set_superclass_id(std::optional<HeapGraphClassTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_, res_value);
      }
        void set_classloader_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_, res);
    }
          void set_kind(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::kind>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    HeapGraphClassTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const HeapGraphClassTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> location() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> classloader_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_);
    }
          StringPool::Id kind() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::kind>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const HeapGraphClassTable* table_;
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
    HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> location() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::location>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::superclass_id>(kSpec);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> classloader_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::classloader_id>(kSpec);
    }
      StringPool::Id kind() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::kind>(kSpec);
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

    HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> location() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::location>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::superclass_id>(kSpec);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> classloader_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::classloader_id>(kSpec);
    }
      StringPool::Id kind() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::kind>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
      void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, res_value);
    }
      void set_location(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::location>(kSpec, res_value);
    }
      void set_superclass_id(std::optional<HeapGraphClassTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::superclass_id>(kSpec, res_value);
      }
    void set_classloader_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::classloader_id>(kSpec, res);
    }
      void set_kind(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::kind>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(HeapGraphClassTable* table) : table_(table) {
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
      HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> location() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> classloader_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_);
    }
          StringPool::Id kind() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::kind>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_deobfuscated_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_, res_value);
    }
          void set_location(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::location>(kSpec, row_, res_value);
    }
          void set_superclass_id(std::optional<HeapGraphClassTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_, res_value);
      }
        void set_classloader_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_, res);
    }
          void set_kind(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::kind>(kSpec, row_, res_value);
    }

    private:
      HeapGraphClassTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const HeapGraphClassTable* table) : table_(table) {
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
      HeapGraphClassTable::Id id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> location() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::location>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<HeapGraphClassTable::Id> superclass_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::superclass_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphClassTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> classloader_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::classloader_id>(kSpec, row_);
    }
          StringPool::Id kind() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::kind>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const HeapGraphClassTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}, std::optional<StringPool::Id> _deobfuscated_name = {}, std::optional<StringPool::Id> _location = {}, std::optional<HeapGraphClassTable::Id> _superclass_id = {}, std::optional<uint32_t> _classloader_id = {}, StringPool::Id _kind = {}) : name(std::move(_name)), deobfuscated_name(std::move(_deobfuscated_name)), location(std::move(_location)), superclass_id(std::move(_superclass_id)), classloader_id(std::move(_classloader_id)), kind(std::move(_kind)) {}

    bool operator==(const Row& other) const {
      return std::tie(name, deobfuscated_name, location, superclass_id, classloader_id, kind) ==
             std::tie(other.name, other.deobfuscated_name, other.location, other.superclass_id, other.classloader_id, other.kind);
    }

        StringPool::Id name;
    std::optional<StringPool::Id> deobfuscated_name;
    std::optional<StringPool::Id> location;
    std::optional<HeapGraphClassTable::Id> superclass_id;
    std::optional<uint32_t> classloader_id;
    StringPool::Id kind;
  };

  explicit HeapGraphClassTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.deobfuscated_name && row.deobfuscated_name != StringPool::Id::Null() ? std::make_optional(*row.deobfuscated_name) : std::nullopt, row.location && row.location != StringPool::Id::Null() ? std::make_optional(*row.location) : std::nullopt, row.superclass_id ? std::make_optional(row.superclass_id->value) : std::nullopt, row.classloader_id, row.kind != StringPool::Id::Null() ? std::make_optional(row.kind) : std::nullopt);
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
    return "__intrinsic_heap_graph_class";
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



class HeapGraphObjectTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","upid","graph_sample_ts","self_size","native_size","reference_set_id","reachable","heap_type","type_id","root_type","root_distance"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(HeapGraphObjectTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const HeapGraphObjectTable& table) const {
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
    static constexpr uint32_t upid = 1;
    static constexpr uint32_t graph_sample_ts = 2;
    static constexpr uint32_t self_size = 3;
    static constexpr uint32_t native_size = 4;
    static constexpr uint32_t reference_set_id = 5;
    static constexpr uint32_t reachable = 6;
    static constexpr uint32_t heap_type = 7;
    static constexpr uint32_t type_id = 8;
    static constexpr uint32_t root_type = 9;
    static constexpr uint32_t root_distance = 10;
  };
  struct RowReference {
   public:
    explicit RowReference(HeapGraphObjectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec, row_);
    }
        int64_t self_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::self_size>(kSpec, row_);
    }
        int64_t native_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::native_size>(kSpec, row_);
    }
        std::optional<uint32_t> reference_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_);
    }
        int32_t reachable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reachable>(kSpec, row_);
    }
          std::optional<StringPool::Id> heap_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::type_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> root_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        int32_t root_distance() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_);
    }
    void set_self_size(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::self_size>(kSpec, row_, res);
    }
        void set_native_size(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::native_size>(kSpec, row_, res);
    }
        void set_reference_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_, res);
    }
        void set_reachable(int32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::reachable>(kSpec, row_, res);
    }
          void set_heap_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_, res_value);
    }
          void set_type_id(HeapGraphClassTable::Id res) {
        
        table_->dataframe_.SetCellUnchecked<ColumnIndex::type_id>(kSpec, row_, res.value);
      }
          void set_root_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::root_type>(kSpec, row_, res_value);
    }
        void set_root_distance(int32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    HeapGraphObjectTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const HeapGraphObjectTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec, row_);
    }
        int64_t self_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::self_size>(kSpec, row_);
    }
        int64_t native_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::native_size>(kSpec, row_);
    }
        std::optional<uint32_t> reference_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_);
    }
        int32_t reachable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reachable>(kSpec, row_);
    }
          std::optional<StringPool::Id> heap_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::type_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> root_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        int32_t root_distance() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const HeapGraphObjectTable* table_;
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
    HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec);
    }
    int64_t self_size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::self_size>(kSpec);
    }
    int64_t native_size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::native_size>(kSpec);
    }
    std::optional<uint32_t> reference_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec);
    }
    int32_t reachable() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::reachable>(kSpec);
    }
      std::optional<StringPool::Id> heap_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::heap_type>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{cursor_.GetCellUnchecked<ColumnIndex::type_id>(kSpec)};
      }
      std::optional<StringPool::Id> root_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::root_type>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    int32_t root_distance() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::root_distance>(kSpec);
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

    HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec);
    }
    int64_t self_size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::self_size>(kSpec);
    }
    int64_t native_size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::native_size>(kSpec);
    }
    std::optional<uint32_t> reference_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec);
    }
    int32_t reachable() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::reachable>(kSpec);
    }
      std::optional<StringPool::Id> heap_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::heap_type>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{cursor_.GetCellUnchecked<ColumnIndex::type_id>(kSpec)};
      }
      std::optional<StringPool::Id> root_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::root_type>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    int32_t root_distance() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::root_distance>(kSpec);
    }
    void set_self_size(int64_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::self_size>(kSpec, res);
    }
    void set_native_size(int64_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::native_size>(kSpec, res);
    }
    void set_reference_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, res);
    }
    void set_reachable(int32_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::reachable>(kSpec, res);
    }
      void set_heap_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::heap_type>(kSpec, res_value);
    }
      void set_type_id(HeapGraphClassTable::Id res) {
        
        cursor_.SetCellUnchecked<ColumnIndex::type_id>(kSpec, res.value);
      }
      void set_root_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::root_type>(kSpec, res_value);
    }
    void set_root_distance(int32_t res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::root_distance>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(HeapGraphObjectTable* table) : table_(table) {
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
      HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec, row_);
    }
        int64_t self_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::self_size>(kSpec, row_);
    }
        int64_t native_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::native_size>(kSpec, row_);
    }
        std::optional<uint32_t> reference_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_);
    }
        int32_t reachable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reachable>(kSpec, row_);
    }
          std::optional<StringPool::Id> heap_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::type_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> root_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        int32_t root_distance() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_);
    }
      void set_self_size(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::self_size>(kSpec, row_, res);
    }
        void set_native_size(int64_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::native_size>(kSpec, row_, res);
    }
        void set_reference_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_, res);
    }
        void set_reachable(int32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::reachable>(kSpec, row_, res);
    }
          void set_heap_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_, res_value);
    }
          void set_type_id(HeapGraphClassTable::Id res) {
        
        table_->dataframe_.SetCellUnchecked<ColumnIndex::type_id>(kSpec, row_, res.value);
      }
          void set_root_type(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::root_type>(kSpec, row_, res_value);
    }
        void set_root_distance(int32_t res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_, res);
    }

    private:
      HeapGraphObjectTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const HeapGraphObjectTable* table) : table_(table) {
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
      HeapGraphObjectTable::Id id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t graph_sample_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::graph_sample_ts>(kSpec, row_);
    }
        int64_t self_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::self_size>(kSpec, row_);
    }
        int64_t native_size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::native_size>(kSpec, row_);
    }
        std::optional<uint32_t> reference_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reference_set_id>(kSpec, row_);
    }
        int32_t reachable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::reachable>(kSpec, row_);
    }
          std::optional<StringPool::Id> heap_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::heap_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          HeapGraphClassTable::Id type_id() const {
        
        return HeapGraphClassTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::type_id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> root_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        int32_t root_distance() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::root_distance>(kSpec, row_);
    }

    private:
      const HeapGraphObjectTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _upid = {}, int64_t _graph_sample_ts = {}, int64_t _self_size = {}, int64_t _native_size = {}, std::optional<uint32_t> _reference_set_id = {}, int32_t _reachable = {}, std::optional<StringPool::Id> _heap_type = {}, HeapGraphClassTable::Id _type_id = {}, std::optional<StringPool::Id> _root_type = {}, int32_t _root_distance = {}) : upid(std::move(_upid)), graph_sample_ts(std::move(_graph_sample_ts)), self_size(std::move(_self_size)), native_size(std::move(_native_size)), reference_set_id(std::move(_reference_set_id)), reachable(std::move(_reachable)), heap_type(std::move(_heap_type)), type_id(std::move(_type_id)), root_type(std::move(_root_type)), root_distance(std::move(_root_distance)) {}

    bool operator==(const Row& other) const {
      return std::tie(upid, graph_sample_ts, self_size, native_size, reference_set_id, reachable, heap_type, type_id, root_type, root_distance) ==
             std::tie(other.upid, other.graph_sample_ts, other.self_size, other.native_size, other.reference_set_id, other.reachable, other.heap_type, other.type_id, other.root_type, other.root_distance);
    }

        uint32_t upid;
    int64_t graph_sample_ts;
    int64_t self_size;
    int64_t native_size;
    std::optional<uint32_t> reference_set_id;
    int32_t reachable;
    std::optional<StringPool::Id> heap_type;
    HeapGraphClassTable::Id type_id;
    std::optional<StringPool::Id> root_type;
    int32_t root_distance;
  };

  explicit HeapGraphObjectTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.upid, row.graph_sample_ts, row.self_size, row.native_size, row.reference_set_id, row.reachable, row.heap_type && row.heap_type != StringPool::Id::Null() ? std::make_optional(*row.heap_type) : std::nullopt, row.type_id.value, row.root_type && row.root_type != StringPool::Id::Null() ? std::make_optional(*row.root_type) : std::nullopt, row.root_distance);
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
    return "__intrinsic_heap_graph_object";
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



class HeapGraphReferenceTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","reference_set_id","owner_id","owned_id","field_name","field_type_name","deobfuscated_field_name"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::SetIdSorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(HeapGraphReferenceTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const HeapGraphReferenceTable& table) const {
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
    static constexpr uint32_t reference_set_id = 1;
    static constexpr uint32_t owner_id = 2;
    static constexpr uint32_t owned_id = 3;
    static constexpr uint32_t field_name = 4;
    static constexpr uint32_t field_type_name = 5;
    static constexpr uint32_t deobfuscated_field_name = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(HeapGraphReferenceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::owner_id>(kSpec, row_)};
      }
          std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::owned_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
          StringPool::Id field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id field_type_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_field_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::field_name>(kSpec, row_, res_value);
    }
          void set_field_type_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_, res_value);
    }
          void set_deobfuscated_field_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    HeapGraphReferenceTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const HeapGraphReferenceTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::owner_id>(kSpec, row_)};
      }
          std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::owned_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
          StringPool::Id field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id field_type_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const HeapGraphReferenceTable* table_;
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
    HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::owner_id>(kSpec)};
      }
      std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::owned_id>(kSpec);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
      StringPool::Id field_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::field_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id field_type_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::field_type_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
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

    HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{cursor_.GetCellUnchecked<ColumnIndex::owner_id>(kSpec)};
      }
      std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::owned_id>(kSpec);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
      StringPool::Id field_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::field_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id field_type_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::field_type_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_field_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::field_name>(kSpec, res_value);
    }
      void set_field_type_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::field_type_name>(kSpec, res_value);
    }
      void set_deobfuscated_field_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(HeapGraphReferenceTable* table) : table_(table) {
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
      HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::owner_id>(kSpec, row_)};
      }
          std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::owned_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
          StringPool::Id field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id field_type_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      void set_field_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::field_name>(kSpec, row_, res_value);
    }
          void set_field_type_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_, res_value);
    }
          void set_deobfuscated_field_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_, res_value);
    }

    private:
      HeapGraphReferenceTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const HeapGraphReferenceTable* table) : table_(table) {
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
      HeapGraphReferenceTable::Id id() const {
        
        return HeapGraphReferenceTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          HeapGraphObjectTable::Id owner_id() const {
        
        return HeapGraphObjectTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::owner_id>(kSpec, row_)};
      }
          std::optional<HeapGraphObjectTable::Id> owned_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::owned_id>(kSpec, row_);
        return res ? std::make_optional(HeapGraphObjectTable::Id{*res}) : std::nullopt;
      }
          StringPool::Id field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id field_type_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::field_type_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> deobfuscated_field_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::deobfuscated_field_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }

    private:
      const HeapGraphReferenceTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _reference_set_id = {}, HeapGraphObjectTable::Id _owner_id = {}, std::optional<HeapGraphObjectTable::Id> _owned_id = {}, StringPool::Id _field_name = {}, StringPool::Id _field_type_name = {}, std::optional<StringPool::Id> _deobfuscated_field_name = {}) : reference_set_id(std::move(_reference_set_id)), owner_id(std::move(_owner_id)), owned_id(std::move(_owned_id)), field_name(std::move(_field_name)), field_type_name(std::move(_field_type_name)), deobfuscated_field_name(std::move(_deobfuscated_field_name)) {}

    bool operator==(const Row& other) const {
      return std::tie(reference_set_id, owner_id, owned_id, field_name, field_type_name, deobfuscated_field_name) ==
             std::tie(other.reference_set_id, other.owner_id, other.owned_id, other.field_name, other.field_type_name, other.deobfuscated_field_name);
    }

        uint32_t reference_set_id;
    HeapGraphObjectTable::Id owner_id;
    std::optional<HeapGraphObjectTable::Id> owned_id;
    StringPool::Id field_name;
    StringPool::Id field_type_name;
    std::optional<StringPool::Id> deobfuscated_field_name;
  };

  explicit HeapGraphReferenceTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.reference_set_id, row.owner_id.value, row.owned_id ? std::make_optional(row.owned_id->value) : std::nullopt, row.field_name != StringPool::Id::Null() ? std::make_optional(row.field_name) : std::nullopt, row.field_type_name != StringPool::Id::Null() ? std::make_optional(row.field_type_name) : std::nullopt, row.deobfuscated_field_name && row.deobfuscated_field_name != StringPool::Id::Null() ? std::make_optional(*row.deobfuscated_field_name) : std::nullopt);
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
    return "__intrinsic_heap_graph_reference";
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



class InstrumentsSampleTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","utid","callsite_id","cpu"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(InstrumentsSampleTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const InstrumentsSampleTable& table) const {
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
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t utid = 2;
    static constexpr uint32_t callsite_id = 3;
    static constexpr uint32_t cpu = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(InstrumentsSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    InstrumentsSampleTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const InstrumentsSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const InstrumentsSampleTable* table_;
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
    InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
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

    InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(InstrumentsSampleTable* table) : table_(table) {
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
      InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
      

    private:
      InstrumentsSampleTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const InstrumentsSampleTable* table) : table_(table) {
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
      InstrumentsSampleTable::Id id() const {
        
        return InstrumentsSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }

    private:
      const InstrumentsSampleTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, uint32_t _utid = {}, std::optional<StackProfileCallsiteTable::Id> _callsite_id = {}, std::optional<uint32_t> _cpu = {}) : ts(std::move(_ts)), utid(std::move(_utid)), callsite_id(std::move(_callsite_id)), cpu(std::move(_cpu)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, utid, callsite_id, cpu) ==
             std::tie(other.ts, other.utid, other.callsite_id, other.cpu);
    }

        int64_t ts;
    uint32_t utid;
    std::optional<StackProfileCallsiteTable::Id> callsite_id;
    std::optional<uint32_t> cpu;
  };

  explicit InstrumentsSampleTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.utid, row.callsite_id ? std::make_optional(row.callsite_id->value) : std::nullopt, row.cpu);
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
    return "instruments_sample";
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



class HeapProfileAllocationTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","upid","heap_name","callsite_id","count","size"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(HeapProfileAllocationTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const HeapProfileAllocationTable& table) const {
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
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t upid = 2;
    static constexpr uint32_t heap_name = 3;
    static constexpr uint32_t callsite_id = 4;
    static constexpr uint32_t count = 5;
    static constexpr uint32_t size = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(HeapProfileAllocationTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        int64_t count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    HeapProfileAllocationTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const HeapProfileAllocationTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        int64_t count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const HeapProfileAllocationTable* table_;
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
    HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t upid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
      StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec)};
      }
    int64_t count() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::count>(kSpec);
    }
    int64_t size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
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

    HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t upid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
      StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec)};
      }
    int64_t count() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::count>(kSpec);
    }
    int64_t size() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(HeapProfileAllocationTable* table) : table_(table) {
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
      HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        int64_t count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
      

    private:
      HeapProfileAllocationTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const HeapProfileAllocationTable* table) : table_(table) {
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
      HeapProfileAllocationTable::Id id() const {
        
        return HeapProfileAllocationTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
          StackProfileCallsiteTable::Id callsite_id() const {
        
        return StackProfileCallsiteTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_)};
      }
        int64_t count() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::count>(kSpec, row_);
    }
        int64_t size() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }

    private:
      const HeapProfileAllocationTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, uint32_t _upid = {}, StringPool::Id _heap_name = {}, StackProfileCallsiteTable::Id _callsite_id = {}, int64_t _count = {}, int64_t _size = {}) : ts(std::move(_ts)), upid(std::move(_upid)), heap_name(std::move(_heap_name)), callsite_id(std::move(_callsite_id)), count(std::move(_count)), size(std::move(_size)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, upid, heap_name, callsite_id, count, size) ==
             std::tie(other.ts, other.upid, other.heap_name, other.callsite_id, other.count, other.size);
    }

        int64_t ts;
    uint32_t upid;
    StringPool::Id heap_name;
    StackProfileCallsiteTable::Id callsite_id;
    int64_t count;
    int64_t size;
  };

  explicit HeapProfileAllocationTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.upid, row.heap_name != StringPool::Id::Null() ? std::make_optional(row.heap_name) : std::nullopt, row.callsite_id.value, row.count, row.size);
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
    return "heap_profile_allocation";
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



class PackageListTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","package_name","uid","debuggable","profileable_from_shell","version_code"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(PackageListTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const PackageListTable& table) const {
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
    static constexpr uint32_t package_name = 1;
    static constexpr uint32_t uid = 2;
    static constexpr uint32_t debuggable = 3;
    static constexpr uint32_t profileable_from_shell = 4;
    static constexpr uint32_t version_code = 5;
  };
  struct RowReference {
   public:
    explicit RowReference(PackageListTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    PackageListTable::Id id() const {
        
        return PackageListTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id package_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::package_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t uid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        int32_t debuggable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::debuggable>(kSpec, row_);
    }
        int32_t profileable_from_shell() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec, row_);
    }
        int64_t version_code() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::version_code>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    PackageListTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const PackageListTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    PackageListTable::Id id() const {
        
        return PackageListTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id package_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::package_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t uid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        int32_t debuggable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::debuggable>(kSpec, row_);
    }
        int32_t profileable_from_shell() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec, row_);
    }
        int64_t version_code() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::version_code>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const PackageListTable* table_;
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
    PackageListTable::Id id() const {
        
        return PackageListTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id package_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::package_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t uid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::uid>(kSpec);
    }
    int32_t debuggable() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::debuggable>(kSpec);
    }
    int32_t profileable_from_shell() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec);
    }
    int64_t version_code() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::version_code>(kSpec);
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

    PackageListTable::Id id() const {
        
        return PackageListTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id package_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::package_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t uid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::uid>(kSpec);
    }
    int32_t debuggable() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::debuggable>(kSpec);
    }
    int32_t profileable_from_shell() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec);
    }
    int64_t version_code() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::version_code>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(PackageListTable* table) : table_(table) {
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
      PackageListTable::Id id() const {
        
        return PackageListTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id package_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::package_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t uid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        int32_t debuggable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::debuggable>(kSpec, row_);
    }
        int32_t profileable_from_shell() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec, row_);
    }
        int64_t version_code() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::version_code>(kSpec, row_);
    }
      

    private:
      PackageListTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const PackageListTable* table) : table_(table) {
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
      PackageListTable::Id id() const {
        
        return PackageListTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id package_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::package_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t uid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        int32_t debuggable() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::debuggable>(kSpec, row_);
    }
        int32_t profileable_from_shell() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::profileable_from_shell>(kSpec, row_);
    }
        int64_t version_code() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::version_code>(kSpec, row_);
    }

    private:
      const PackageListTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _package_name = {}, int64_t _uid = {}, int32_t _debuggable = {}, int32_t _profileable_from_shell = {}, int64_t _version_code = {}) : package_name(std::move(_package_name)), uid(std::move(_uid)), debuggable(std::move(_debuggable)), profileable_from_shell(std::move(_profileable_from_shell)), version_code(std::move(_version_code)) {}

    bool operator==(const Row& other) const {
      return std::tie(package_name, uid, debuggable, profileable_from_shell, version_code) ==
             std::tie(other.package_name, other.uid, other.debuggable, other.profileable_from_shell, other.version_code);
    }

        StringPool::Id package_name;
    int64_t uid;
    int32_t debuggable;
    int32_t profileable_from_shell;
    int64_t version_code;
  };

  explicit PackageListTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.package_name != StringPool::Id::Null() ? std::make_optional(row.package_name) : std::nullopt, row.uid, row.debuggable, row.profileable_from_shell, row.version_code);
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
    return "package_list";
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



class PerfSessionTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","cmdline"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(PerfSessionTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const PerfSessionTable& table) const {
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
    static constexpr uint32_t cmdline = 1;
  };
  struct RowReference {
   public:
    explicit RowReference(PerfSessionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> cmdline() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_cmdline(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    PerfSessionTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const PerfSessionTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> cmdline() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const PerfSessionTable* table_;
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
    PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      std::optional<StringPool::Id> cmdline() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::cmdline>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
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

    PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      std::optional<StringPool::Id> cmdline() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::cmdline>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_cmdline(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(PerfSessionTable* table) : table_(table) {
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
      PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> cmdline() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      void set_cmdline(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_, res_value);
    }

    private:
      PerfSessionTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const PerfSessionTable* table) : table_(table) {
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
      PerfSessionTable::Id id() const {
        
        return PerfSessionTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> cmdline() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }

    private:
      const PerfSessionTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(std::optional<StringPool::Id> _cmdline = {}) : cmdline(std::move(_cmdline)) {}

    bool operator==(const Row& other) const {
      return std::tie(cmdline) ==
             std::tie(other.cmdline);
    }

        std::optional<StringPool::Id> cmdline;
  };

  explicit PerfSessionTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.cmdline && row.cmdline != StringPool::Id::Null() ? std::make_optional(*row.cmdline) : std::nullopt);
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
    return "__intrinsic_perf_session";
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



class PerfSampleTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","utid","cpu","cpu_mode","callsite_id","unwind_error","perf_session_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
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

    RowReference ToRowReference(PerfSampleTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const PerfSampleTable& table) const {
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
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t utid = 2;
    static constexpr uint32_t cpu = 3;
    static constexpr uint32_t cpu_mode = 4;
    static constexpr uint32_t callsite_id = 5;
    static constexpr uint32_t unwind_error = 6;
    static constexpr uint32_t perf_session_id = 7;
  };
  struct RowReference {
   public:
    explicit RowReference(PerfSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    PerfSampleTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const PerfSampleTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const PerfSampleTable* table_;
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
    PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t utid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
      std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
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

    PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    uint32_t utid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
    }
      std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::callsite_id>(kSpec);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(PerfSampleTable* table) : table_(table) {
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
      PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }
      

    private:
      PerfSampleTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const PerfSampleTable* table) : table_(table) {
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
      PerfSampleTable::Id id() const {
        
        return PerfSampleTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        uint32_t utid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
    }
          std::optional<StackProfileCallsiteTable::Id> callsite_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::callsite_id>(kSpec, row_);
        return res ? std::make_optional(StackProfileCallsiteTable::Id{*res}) : std::nullopt;
      }

    private:
      const PerfSampleTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, uint32_t _utid = {}, std::optional<uint32_t> _cpu = {}, StringPool::Id _cpu_mode = {}, std::optional<StackProfileCallsiteTable::Id> _callsite_id = {}, std::optional<StringPool::Id> _unwind_error = {}, PerfSessionTable::Id _perf_session_id = {}) : ts(std::move(_ts)), utid(std::move(_utid)), cpu(std::move(_cpu)), cpu_mode(std::move(_cpu_mode)), callsite_id(std::move(_callsite_id)), unwind_error(std::move(_unwind_error)), perf_session_id(std::move(_perf_session_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, utid, cpu, cpu_mode, callsite_id, unwind_error, perf_session_id) ==
             std::tie(other.ts, other.utid, other.cpu, other.cpu_mode, other.callsite_id, other.unwind_error, other.perf_session_id);
    }

        int64_t ts;
    uint32_t utid;
    std::optional<uint32_t> cpu;
    StringPool::Id cpu_mode;
    std::optional<StackProfileCallsiteTable::Id> callsite_id;
    std::optional<StringPool::Id> unwind_error;
    PerfSessionTable::Id perf_session_id;
  };

  explicit PerfSampleTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.utid, row.cpu, row.cpu_mode != StringPool::Id::Null() ? std::make_optional(row.cpu_mode) : std::nullopt, row.callsite_id ? std::make_optional(row.callsite_id->value) : std::nullopt, row.unwind_error && row.unwind_error != StringPool::Id::Null() ? std::make_optional(*row.unwind_error) : std::nullopt, row.perf_session_id.value);
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
    return "perf_sample";
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



class ProfilerSmapsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","upid","ts","path","size_kb","private_dirty_kb","swap_kb","file_name","start_address","module_timestamp","module_debugid","module_debug_path","protection_flags","private_clean_resident_kb","shared_dirty_resident_kb","shared_clean_resident_kb","locked_kb","proportional_resident_kb"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ProfilerSmapsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ProfilerSmapsTable& table) const {
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
    static constexpr uint32_t upid = 1;
    static constexpr uint32_t ts = 2;
    static constexpr uint32_t path = 3;
    static constexpr uint32_t size_kb = 4;
    static constexpr uint32_t private_dirty_kb = 5;
    static constexpr uint32_t swap_kb = 6;
    static constexpr uint32_t file_name = 7;
    static constexpr uint32_t start_address = 8;
    static constexpr uint32_t module_timestamp = 9;
    static constexpr uint32_t module_debugid = 10;
    static constexpr uint32_t module_debug_path = 11;
    static constexpr uint32_t protection_flags = 12;
    static constexpr uint32_t private_clean_resident_kb = 13;
    static constexpr uint32_t shared_dirty_resident_kb = 14;
    static constexpr uint32_t shared_clean_resident_kb = 15;
    static constexpr uint32_t locked_kb = 16;
    static constexpr uint32_t proportional_resident_kb = 17;
  };
  struct RowReference {
   public:
    explicit RowReference(ProfilerSmapsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t size_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size_kb>(kSpec, row_);
    }
        int64_t private_dirty_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec, row_);
    }
        int64_t swap_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::swap_kb>(kSpec, row_);
    }
          StringPool::Id file_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::file_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t start_address() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t module_timestamp() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec, row_);
    }
          StringPool::Id module_debugid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debugid>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id module_debug_path() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t protection_flags() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::protection_flags>(kSpec, row_);
    }
        int64_t private_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec, row_);
    }
        int64_t shared_dirty_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec, row_);
    }
        int64_t shared_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec, row_);
    }
        int64_t proportional_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ProfilerSmapsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ProfilerSmapsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t size_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size_kb>(kSpec, row_);
    }
        int64_t private_dirty_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec, row_);
    }
        int64_t swap_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::swap_kb>(kSpec, row_);
    }
          StringPool::Id file_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::file_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t start_address() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t module_timestamp() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec, row_);
    }
          StringPool::Id module_debugid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debugid>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id module_debug_path() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t protection_flags() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::protection_flags>(kSpec, row_);
    }
        int64_t private_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec, row_);
    }
        int64_t shared_dirty_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec, row_);
    }
        int64_t shared_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec, row_);
    }
        int64_t proportional_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ProfilerSmapsTable* table_;
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
    ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t upid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t size_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::size_kb>(kSpec);
    }
    int64_t private_dirty_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec);
    }
    int64_t swap_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::swap_kb>(kSpec);
    }
      StringPool::Id file_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::file_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t start_address() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_address>(kSpec);
    }
    int64_t module_timestamp() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec);
    }
      StringPool::Id module_debugid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::module_debugid>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id module_debug_path() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t protection_flags() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::protection_flags>(kSpec);
    }
    int64_t private_clean_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec);
    }
    int64_t shared_dirty_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec);
    }
    int64_t shared_clean_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec);
    }
    int64_t proportional_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec);
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

    ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t upid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
    }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t size_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::size_kb>(kSpec);
    }
    int64_t private_dirty_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec);
    }
    int64_t swap_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::swap_kb>(kSpec);
    }
      StringPool::Id file_name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::file_name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t start_address() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_address>(kSpec);
    }
    int64_t module_timestamp() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec);
    }
      StringPool::Id module_debugid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::module_debugid>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id module_debug_path() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    int64_t protection_flags() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::protection_flags>(kSpec);
    }
    int64_t private_clean_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec);
    }
    int64_t shared_dirty_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec);
    }
    int64_t shared_clean_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec);
    }
    int64_t proportional_resident_kb() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ProfilerSmapsTable* table) : table_(table) {
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
      ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t size_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size_kb>(kSpec, row_);
    }
        int64_t private_dirty_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec, row_);
    }
        int64_t swap_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::swap_kb>(kSpec, row_);
    }
          StringPool::Id file_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::file_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t start_address() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t module_timestamp() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec, row_);
    }
          StringPool::Id module_debugid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debugid>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id module_debug_path() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t protection_flags() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::protection_flags>(kSpec, row_);
    }
        int64_t private_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec, row_);
    }
        int64_t shared_dirty_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec, row_);
    }
        int64_t shared_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec, row_);
    }
        int64_t proportional_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec, row_);
    }
      

    private:
      ProfilerSmapsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ProfilerSmapsTable* table) : table_(table) {
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
      ProfilerSmapsTable::Id id() const {
        
        return ProfilerSmapsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t upid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
    }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t size_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size_kb>(kSpec, row_);
    }
        int64_t private_dirty_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_dirty_kb>(kSpec, row_);
    }
        int64_t swap_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::swap_kb>(kSpec, row_);
    }
          StringPool::Id file_name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::file_name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t start_address() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_address>(kSpec, row_);
    }
        int64_t module_timestamp() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_timestamp>(kSpec, row_);
    }
          StringPool::Id module_debugid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debugid>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id module_debug_path() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::module_debug_path>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        int64_t protection_flags() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::protection_flags>(kSpec, row_);
    }
        int64_t private_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::private_clean_resident_kb>(kSpec, row_);
    }
        int64_t shared_dirty_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_dirty_resident_kb>(kSpec, row_);
    }
        int64_t shared_clean_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::shared_clean_resident_kb>(kSpec, row_);
    }
        int64_t proportional_resident_kb() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::proportional_resident_kb>(kSpec, row_);
    }

    private:
      const ProfilerSmapsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _upid = {}, int64_t _ts = {}, StringPool::Id _path = {}, int64_t _size_kb = {}, int64_t _private_dirty_kb = {}, int64_t _swap_kb = {}, StringPool::Id _file_name = {}, int64_t _start_address = {}, int64_t _module_timestamp = {}, StringPool::Id _module_debugid = {}, StringPool::Id _module_debug_path = {}, int64_t _protection_flags = {}, int64_t _private_clean_resident_kb = {}, int64_t _shared_dirty_resident_kb = {}, int64_t _shared_clean_resident_kb = {}, int64_t _locked_kb = {}, int64_t _proportional_resident_kb = {}) : upid(std::move(_upid)), ts(std::move(_ts)), path(std::move(_path)), size_kb(std::move(_size_kb)), private_dirty_kb(std::move(_private_dirty_kb)), swap_kb(std::move(_swap_kb)), file_name(std::move(_file_name)), start_address(std::move(_start_address)), module_timestamp(std::move(_module_timestamp)), module_debugid(std::move(_module_debugid)), module_debug_path(std::move(_module_debug_path)), protection_flags(std::move(_protection_flags)), private_clean_resident_kb(std::move(_private_clean_resident_kb)), shared_dirty_resident_kb(std::move(_shared_dirty_resident_kb)), shared_clean_resident_kb(std::move(_shared_clean_resident_kb)), locked_kb(std::move(_locked_kb)), proportional_resident_kb(std::move(_proportional_resident_kb)) {}

    bool operator==(const Row& other) const {
      return std::tie(upid, ts, path, size_kb, private_dirty_kb, swap_kb, file_name, start_address, module_timestamp, module_debugid, module_debug_path, protection_flags, private_clean_resident_kb, shared_dirty_resident_kb, shared_clean_resident_kb, locked_kb, proportional_resident_kb) ==
             std::tie(other.upid, other.ts, other.path, other.size_kb, other.private_dirty_kb, other.swap_kb, other.file_name, other.start_address, other.module_timestamp, other.module_debugid, other.module_debug_path, other.protection_flags, other.private_clean_resident_kb, other.shared_dirty_resident_kb, other.shared_clean_resident_kb, other.locked_kb, other.proportional_resident_kb);
    }

        uint32_t upid;
    int64_t ts;
    StringPool::Id path;
    int64_t size_kb;
    int64_t private_dirty_kb;
    int64_t swap_kb;
    StringPool::Id file_name;
    int64_t start_address;
    int64_t module_timestamp;
    StringPool::Id module_debugid;
    StringPool::Id module_debug_path;
    int64_t protection_flags;
    int64_t private_clean_resident_kb;
    int64_t shared_dirty_resident_kb;
    int64_t shared_clean_resident_kb;
    int64_t locked_kb;
    int64_t proportional_resident_kb;
  };

  explicit ProfilerSmapsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.upid, row.ts, row.path != StringPool::Id::Null() ? std::make_optional(row.path) : std::nullopt, row.size_kb, row.private_dirty_kb, row.swap_kb, row.file_name != StringPool::Id::Null() ? std::make_optional(row.file_name) : std::nullopt, row.start_address, row.module_timestamp, row.module_debugid != StringPool::Id::Null() ? std::make_optional(row.module_debugid) : std::nullopt, row.module_debug_path != StringPool::Id::Null() ? std::make_optional(row.module_debug_path) : std::nullopt, row.protection_flags, row.private_clean_resident_kb, row.shared_dirty_resident_kb, row.shared_clean_resident_kb, row.locked_kb, row.proportional_resident_kb);
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
    return "profiler_smaps";
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



class SymbolTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","symbol_set_id","name","source_file","line_number"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::SetIdSorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(SymbolTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const SymbolTable& table) const {
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
    static constexpr uint32_t symbol_set_id = 1;
    static constexpr uint32_t name = 2;
    static constexpr uint32_t source_file = 3;
    static constexpr uint32_t line_number = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(SymbolTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    SymbolTable::Id id() const {
        
        return SymbolTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> source_file() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    SymbolTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const SymbolTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    SymbolTable::Id id() const {
        
        return SymbolTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> source_file() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const SymbolTable* table_;
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
    SymbolTable::Id id() const {
        
        return SymbolTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t symbol_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> source_file() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::source_file>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> line_number() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::line_number>(kSpec);
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

    SymbolTable::Id id() const {
        
        return SymbolTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t symbol_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<StringPool::Id> source_file() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::source_file>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> line_number() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::line_number>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(SymbolTable* table) : table_(table) {
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
      SymbolTable::Id id() const {
        
        return SymbolTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> source_file() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }
      

    private:
      SymbolTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const SymbolTable* table) : table_(table) {
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
      SymbolTable::Id id() const {
        
        return SymbolTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t symbol_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::symbol_set_id>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<StringPool::Id> source_file() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_file>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> line_number() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::line_number>(kSpec, row_);
    }

    private:
      const SymbolTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _symbol_set_id = {}, StringPool::Id _name = {}, std::optional<StringPool::Id> _source_file = {}, std::optional<uint32_t> _line_number = {}) : symbol_set_id(std::move(_symbol_set_id)), name(std::move(_name)), source_file(std::move(_source_file)), line_number(std::move(_line_number)) {}

    bool operator==(const Row& other) const {
      return std::tie(symbol_set_id, name, source_file, line_number) ==
             std::tie(other.symbol_set_id, other.name, other.source_file, other.line_number);
    }

        uint32_t symbol_set_id;
    StringPool::Id name;
    std::optional<StringPool::Id> source_file;
    std::optional<uint32_t> line_number;
  };

  explicit SymbolTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.symbol_set_id, row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.source_file && row.source_file != StringPool::Id::Null() ? std::make_optional(*row.source_file) : std::nullopt, row.line_number);
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
    return "stack_profile_symbol";
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



class VulkanMemoryAllocationsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","arg_set_id","source","operation","timestamp","upid","device","device_memory","memory_type","heap","function_name","object_handle","memory_address","memory_size","scope"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
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

    RowReference ToRowReference(VulkanMemoryAllocationsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const VulkanMemoryAllocationsTable& table) const {
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
    static constexpr uint32_t arg_set_id = 1;
    static constexpr uint32_t source = 2;
    static constexpr uint32_t operation = 3;
    static constexpr uint32_t timestamp = 4;
    static constexpr uint32_t upid = 5;
    static constexpr uint32_t device = 6;
    static constexpr uint32_t device_memory = 7;
    static constexpr uint32_t memory_type = 8;
    static constexpr uint32_t heap = 9;
    static constexpr uint32_t function_name = 10;
    static constexpr uint32_t object_handle = 11;
    static constexpr uint32_t memory_address = 12;
    static constexpr uint32_t memory_size = 13;
    static constexpr uint32_t scope = 14;
  };
  struct RowReference {
   public:
    explicit RowReference(VulkanMemoryAllocationsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    VulkanMemoryAllocationsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const VulkanMemoryAllocationsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const VulkanMemoryAllocationsTable* table_;
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
    VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
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

    VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(VulkanMemoryAllocationsTable* table) : table_(table) {
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
      VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
      void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }

    private:
      VulkanMemoryAllocationsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const VulkanMemoryAllocationsTable* table) : table_(table) {
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
      VulkanMemoryAllocationsTable::Id id() const {
        
        return VulkanMemoryAllocationsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }

    private:
      const VulkanMemoryAllocationsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(std::optional<uint32_t> _arg_set_id = {}, StringPool::Id _source = {}, StringPool::Id _operation = {}, int64_t _timestamp = {}, std::optional<uint32_t> _upid = {}, std::optional<int64_t> _device = {}, std::optional<int64_t> _device_memory = {}, std::optional<uint32_t> _memory_type = {}, std::optional<uint32_t> _heap = {}, std::optional<StringPool::Id> _function_name = {}, std::optional<int64_t> _object_handle = {}, std::optional<int64_t> _memory_address = {}, std::optional<int64_t> _memory_size = {}, StringPool::Id _scope = {}) : arg_set_id(std::move(_arg_set_id)), source(std::move(_source)), operation(std::move(_operation)), timestamp(std::move(_timestamp)), upid(std::move(_upid)), device(std::move(_device)), device_memory(std::move(_device_memory)), memory_type(std::move(_memory_type)), heap(std::move(_heap)), function_name(std::move(_function_name)), object_handle(std::move(_object_handle)), memory_address(std::move(_memory_address)), memory_size(std::move(_memory_size)), scope(std::move(_scope)) {}

    bool operator==(const Row& other) const {
      return std::tie(arg_set_id, source, operation, timestamp, upid, device, device_memory, memory_type, heap, function_name, object_handle, memory_address, memory_size, scope) ==
             std::tie(other.arg_set_id, other.source, other.operation, other.timestamp, other.upid, other.device, other.device_memory, other.memory_type, other.heap, other.function_name, other.object_handle, other.memory_address, other.memory_size, other.scope);
    }

        std::optional<uint32_t> arg_set_id;
    StringPool::Id source;
    StringPool::Id operation;
    int64_t timestamp;
    std::optional<uint32_t> upid;
    std::optional<int64_t> device;
    std::optional<int64_t> device_memory;
    std::optional<uint32_t> memory_type;
    std::optional<uint32_t> heap;
    std::optional<StringPool::Id> function_name;
    std::optional<int64_t> object_handle;
    std::optional<int64_t> memory_address;
    std::optional<int64_t> memory_size;
    StringPool::Id scope;
  };

  explicit VulkanMemoryAllocationsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.arg_set_id, row.source != StringPool::Id::Null() ? std::make_optional(row.source) : std::nullopt, row.operation != StringPool::Id::Null() ? std::make_optional(row.operation) : std::nullopt, row.timestamp, row.upid, row.device, row.device_memory, row.memory_type, row.heap, row.function_name && row.function_name != StringPool::Id::Null() ? std::make_optional(*row.function_name) : std::nullopt, row.object_handle, row.memory_address, row.memory_size, row.scope != StringPool::Id::Null() ? std::make_optional(row.scope) : std::nullopt);
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
    return "vulkan_memory_allocations";
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

#endif  // SRC_TRACE_PROCESSOR_TABLES_PROFILER_TABLES_PY_H_
